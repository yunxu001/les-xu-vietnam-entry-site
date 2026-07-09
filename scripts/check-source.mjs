import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredFiles = [
  "src/pages/index.astro",
  "src/pages/advisory.astro",
  "src/pages/insights/index.astro",
  "src/pages/resources/vietnam-entry-decision-gate-checklist.astro",
  "src/pages/about.astro",
  "src/pages/contact.astro",
  "src/data/site.ts",
  "src/styles/global.css",
  "public/images/whatsapp-qr.jpg",
  "public/images/wechat-qr.jpg",
  "public/images/zalo-qr.jpg",
  "public/images/post-01-vietnam-not-shortcut-integrated.png",
  "public/images/post-02-market-access-gate-integrated.png",
  "public/images/post-12-first-100-days-integrated.png"
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) failures.push(`missing source file: ${file}`);
}

const textFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.isFile() && /\.(astro|ts|md|mjs|json|css|svg)$/.test(entry.name)) {
      textFiles.push(fullPath);
    }
  }
};
walk(join(root, "src"));
textFiles.push(join(root, "package.json"));
textFiles.push(join(root, "README.md"));

const combined = textFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const requiredText = [
  "Les Xu",
  "Book a Vietnam Entry Reality Check",
  "WhatsApp",
  "WeChat",
  "Zalo",
  "Vietnam Entry Decision Gate Checklist"
];

for (const text of requiredText) {
  if (!combined.includes(text)) failures.push(`missing source text: ${text}`);
}

if (combined.includes("Yun Xu")) failures.push("old public name found: Yun Xu");
if (/linkedin/i.test(combined)) failures.push("LinkedIn reference found");
if (combined.includes("TBD") || combined.includes("TODO")) {
  failures.push("placeholder marker found");
}

if (failures.length > 0) {
  console.error("Source check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Source check passed.");
