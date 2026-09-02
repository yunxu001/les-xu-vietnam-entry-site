import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const command = process.argv[2] || "build";
const args = process.argv.slice(3);
const astroBin = [
  join(root, "node_modules", "astro", "bin", "astro.mjs"),
  join(root, "node_modules", "astro", "astro.js")
].find(existsSync);

if (!existsSync(astroBin)) {
  console.error("Astro is not installed. Run npm install first.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [astroBin, command, ...args], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1"
  }
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
