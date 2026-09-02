import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const repositoryFiles = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const forbiddenPath = /(^|[\\/])(?:\.env(?:\..*)?|credentials(?:\..*)?|service-account[^\\/]*\.json|[^\\/]+\.(?:pem|key|p12|pfx))$/i;
const findings = [];

for (const file of repositoryFiles) {
  // This file contains the detector expressions themselves, so it cannot be scanned as ordinary content.
  if (file === "scripts/check-security.mjs") continue;

  if (forbiddenPath.test(file) && !file.endsWith(".env.example")) {
    findings.push(`sensitive-looking tracked path: ${file}`);
    continue;
  }

  if (!/\.(?:astro|css|csv|json|js|mjs|md|toml|ts|txt|yml|yaml|xml)$/i.test(extname(file))) continue;

  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const patterns = [
    /-----BEGIN [A-Z ]+ PRIVATE KEY-----/,
    /\b(?:ghp_|github_pat_|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|xox[baprs]-[0-9A-Za-z-]{15,})\b/,
    /\b(?:api[_-]?key|client[_-]?secret|password|private[_-]?key|access[_-]?token|refresh[_-]?token)\s*[:=]\s*["'][^"']{12,}["']/i
  ];

  if (patterns.some((pattern) => pattern.test(text))) {
    findings.push(`possible credential pattern in tracked file: ${file}`);
  }
}

if (findings.length) {
  console.error(`Security check failed:\n${findings.map((finding) => `- ${finding}`).join("\n")}`);
  process.exit(1);
}

console.log(`Security check passed for ${repositoryFiles.length} repository files.`);
