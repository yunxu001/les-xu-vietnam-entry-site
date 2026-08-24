import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const siteUrl = "https://business-lens-with-les.netlify.app";
const staticPaths = ["", "services/", "team/", "watch/", "brief/", "relocation/", "insights/", "contact/", "resources/vietnam-entry-decision-gate-checklist/"];
const servicePaths = ["business-advisory-coaching", "ai-business-systems", "cross-border-entry-sourcing", "people-operations-talent"].map((slug) => `services/${slug}/`);
const insightPaths = readdirSync(join(root, "src", "content", "insights"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => `insights/${file.replace(/\.md$/, "")}/`);
const urls = [...staticPaths, ...servicePaths, ...insightPaths];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${siteUrl}/${path}</loc></url>`).join("\n")}\n</urlset>\n`;

writeFileSync(join(root, "public", "sitemap.xml"), xml);
console.log(`Generated sitemap with ${urls.length} URLs.`);
