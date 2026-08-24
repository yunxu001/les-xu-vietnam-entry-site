import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredFiles = [
  "src/pages/index.astro", "src/pages/services/index.astro", "src/pages/services/[slug].astro",
  "src/pages/team.astro", "src/pages/watch.astro", "src/pages/brief.astro", "src/pages/relocation.astro",
  "src/pages/contact.astro", "src/data/site.ts", "src/components/NewsletterForm.astro",
  "public/_redirects", "public/images/whatsapp-qr.jpg", "public/images/wechat-qr.jpg", "public/images/zalo-qr.jpg",
  "public/images/ai-training-operating-system-hero.png", "src/content/insights/sleep-economy-business-opportunity.md",
  "scripts/generate-content-drafts.mjs", "scripts/generate-sitemap.mjs", "scripts/fetch-youtube-feed.mjs"
];
const failures = requiredFiles.filter((file) => !existsSync(join(root, file))).map((file) => `missing source file: ${file}`);
const textFiles = [];
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const fullPath = join(dir, entry.name);
  if (entry.isDirectory()) walk(fullPath);
  if (entry.isFile() && /\.(astro|ts|md|mjs|json|css|svg)$/.test(entry.name)) textFiles.push(fullPath);
});
walk(join(root, "src"));
textFiles.push(join(root, "package.json"));
const combined = textFiles.map((file) => readFileSync(file, "utf8")).join("\n");
for (const text of ["Business Lens with Les", "Business Lens Advisory", "Jeffrey Zhang", "Join the Business Lens Brief", "WhatsApp", "WeChat", "Zalo", "content:drafts"]) {
  if (!combined.includes(text)) failures.push(`missing source text: ${text}`);
}
if (combined.includes("Yun Xu")) failures.push("old public name found: Yun Xu");
if (/USD\s*\d|test range|founding price/i.test(combined)) failures.push("public pricing found");
if (combined.includes("TBD") || combined.includes("TODO")) failures.push("placeholder marker found");
if (failures.length) { console.error(`Source check failed:\n${failures.map((item) => `- ${item}`).join("\n")}`); process.exit(1); }
console.log("Source check passed.");
