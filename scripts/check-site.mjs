import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const requiredRoutes = [
  "index.html",
  "advisory/index.html",
  "insights/index.html",
  "insights/foreigners-start-business-vietnam/index.html",
  "insights/vietnam-company-setup-first-100-days/index.html",
  "insights/vietnam-market-entry-checklist/index.html",
  "insights/vietnam-lease-license-capital-sequence/index.html",
  "insights/china-plus-one-vietnam-sme-guide/index.html",
  "insights/da-nang-vs-ho-chi-minh-business-entry/index.html",
  "resources/vietnam-entry-decision-gate-checklist/index.html",
  "about/index.html",
  "contact/index.html"
];

const failures = [];

if (!existsSync(dist)) {
  failures.push("dist folder is missing. Run npm run build first.");
} else {
  for (const route of requiredRoutes) {
    if (!existsSync(join(dist, route))) {
      failures.push(`missing route: /${route.replace("index.html", "")}`);
    }
  }

  const htmlFiles = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(fullPath);
    }
  };
  walk(dist);

  const combined = htmlFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  const mustInclude = [
    "Les Xu",
    "Book a Vietnam Entry Reality Check",
    "WhatsApp",
    "WeChat",
    "Zalo",
    "Vietnam Entry Decision Gate Checklist",
    "Can foreigners start a business in Vietnam?",
    "China plus one"
  ];

  for (const text of mustInclude) {
    if (!combined.includes(text)) failures.push(`missing public text: ${text}`);
  }

  if (combined.includes("Yun Xu")) {
    failures.push("old public name found: Yun Xu");
  }

  if (/linkedin/i.test(combined)) {
    failures.push("LinkedIn reference found");
  }

  if (
    combined.includes("TBD") ||
    combined.includes("TODO") ||
    combined.includes('href="#"') ||
    combined.includes("href='#'")
  ) {
    failures.push("placeholder text or placeholder links found");
  }
}

if (failures.length > 0) {
  console.error("Site check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Site check passed.");
