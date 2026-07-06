import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const requiredRoutes = [
  "index.html",
  "advisory/index.html",
  "insights/index.html",
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
    "https://www.linkedin.com/in/leslie-xu-43a57413/",
    "Vietnam Entry Decision Gate Checklist"
  ];

  for (const text of mustInclude) {
    if (!combined.includes(text)) failures.push(`missing public text: ${text}`);
  }

  if (combined.includes("Yun Xu")) {
    failures.push("old public name found: Yun Xu");
  }

  if (combined.includes("TBD") || combined.includes("TODO") || combined.includes("#")) {
    failures.push("placeholder text or placeholder links found");
  }
}

if (failures.length > 0) {
  console.error("Site check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Site check passed.");
