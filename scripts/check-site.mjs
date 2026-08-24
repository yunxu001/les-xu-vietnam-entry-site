import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const routes = ["index.html", "services/index.html", "services/ai-business-systems/index.html", "team/index.html", "watch/index.html", "brief/index.html", "relocation/index.html", "insights/index.html", "insights/sleep-economy-business-opportunity/index.html", "contact/index.html"];
const failures = [];
if (!existsSync(dist)) failures.push("dist folder is missing. Run npm run build first.");
else {
  routes.filter((route) => !existsSync(join(dist, route))).forEach((route) => failures.push(`missing route: /${route.replace("index.html", "")}`));
  const htmlFiles = [];
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).forEach((entry) => { const full = join(dir, entry.name); if (entry.isDirectory()) walk(full); if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full); });
  walk(dist);
  const combined = htmlFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  for (const text of ["Business Lens with Les", "Business Lens Advisory", "Jeffrey Zhang", "The Business Lens Brief", "WhatsApp", "WeChat", "Zalo"]) if (!combined.includes(text)) failures.push(`missing public text: ${text}`);
  if (combined.includes("Yun Xu")) failures.push("old public name found: Yun Xu");
  if (combined.includes("les-xu-vietnam-entry-site.netlify.app")) failures.push("old Netlify URL found");
  if (/USD\s*\d|test range|founding price/i.test(combined)) failures.push("public pricing found");
  if (combined.includes("TBD") || combined.includes("TODO") || combined.includes('href="#"') || combined.includes("href='#'")) failures.push("placeholder text or links found");
}
if (failures.length) { console.error(`Site check failed:\n${failures.map((item) => `- ${item}`).join("\n")}`); process.exit(1); }
console.log("Site check passed.");
