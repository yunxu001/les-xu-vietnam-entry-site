import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const insightsDir = join(root, "src", "content", "insights");
const outputDir = join(root, "content-output");
const siteUrl = "https://business-lens-with-les.netlify.app";

const value = (frontmatter, key, fallback = "") => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "m"));
  return match?.[1] || fallback;
};

const parsePost = (fileName) => {
  const raw = readFileSync(join(insightsDir, fileName), "utf8");
  const [, frontmatter = "", body = ""] = raw.split("---");
  const slug = fileName.replace(/\.md$/, "");
  const bullets = body
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .slice(0, 3)
    .map((line) => line.slice(2).trim());
  return {
    slug,
    title: value(frontmatter, "title", slug),
    description: value(frontmatter, "description"),
    author: value(frontmatter, "author", "Business Lens Advisory"),
    pillar: value(frontmatter, "pillar", "Cross-border execution"),
    order: Number(value(frontmatter, "order", "99")),
    bullets
  };
};

const posts = readdirSync(insightsDir)
  .filter((file) => file.endsWith(".md"))
  .map(parsePost)
  .sort((a, b) => a.order - b.order);

if (!existsSync(outputDir)) mkdirSync(outputDir);

const calendar = [
  "week,anchor_topic,website_url,author,pillar,linkedin,x,newsletter,short_video,approval_status",
  ...posts.map((post, index) => [
    index + 1,
    `"${post.title.replaceAll('"', '""')}"`,
    `${siteUrl}/insights/${post.slug}/`,
    post.author,
    `"${post.pillar}"`,
    "draft", "draft", "draft", "draft", "needs human approval"
  ].join(","))
];

const drafts = posts.map((post, index) => {
  const url = `${siteUrl}/insights/${post.slug}/?utm_source=owned&utm_medium=content&utm_campaign=business-lens-brief`;
  const points = post.bullets.length ? post.bullets : ["Name the expensive decision.", "Test the assumption before scale.", "Give the work a clear owner."];
  return `## Week ${index + 1}: ${post.title}

**Anchor:** ${url}

### Website source of truth
Review the article for accuracy, add first-hand examples or sources, and publish only after an author confirms it.

### LinkedIn draft
${post.title}

Most business problems look simpler from a distance. The useful work is making the next decision concrete enough to test.

${points.map((point) => `- ${point}`).join("\n")}

The longer note is here: ${url}

### X draft
${post.title}\n\nThe question is not whether the idea sounds good. It is whether the customer, operating system, and economics hold when the work starts.\n\n${url}

### Newsletter section
**${post.title}**\n${post.description}\nRead: ${url}

### Short-video prompt
Open with the costly assumption. Explain one test in 30-45 seconds. End with the practical next step, then point viewers to the full article.

### Human review checklist
- Confirm facts, examples, claims, and source links.
- Adapt the opening to the platform and the founder posting it.
- Use the tracked link only after the destination page is live.
- Approve posting, comments, replies, and DMs manually.
`;
}).join("\n---\n\n");

const workflow = `# Business Lens Content Workflow

1. Choose one real owner question as the weekly anchor.
2. Publish the reviewed website article as the source of truth.
3. Run \`npm run content:drafts\` to prepare website, LinkedIn, X, newsletter, and short-video drafts.
4. Add first-hand examples, current sources, and the right founder voice.
5. Approve every post, comment, DM, and Reddit contribution manually.
6. Record reach, qualified replies, newsletter subscriptions, and enquiries in the monthly report.

Automation stops at research, drafting, formatting, tracking links, feed retrieval, and reporting. It does not publish to personal accounts or participate in communities on your behalf.
`;

writeFileSync(join(outputDir, "content-calendar.csv"), `${calendar.join("\n")}\n`);
writeFileSync(join(outputDir, "business-lens-drafts.md"), drafts);
writeFileSync(join(outputDir, "workflow.md"), workflow);

console.log(`Generated ${posts.length} approved-review content packs in content-output.`);
