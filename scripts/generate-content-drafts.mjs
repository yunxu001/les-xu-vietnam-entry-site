import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const insightsDir = join(root, "src", "content", "insights");
const outputDir = join(root, "content-output");
const siteUrl = "https://les-xu-vietnam-entry-site.netlify.app";

const parsePost = (fileName) => {
  const raw = readFileSync(join(insightsDir, fileName), "utf8");
  const [, frontmatter = "", body = ""] = raw.split("---");
  const data = Object.fromEntries(
    frontmatter
      .trim()
      .split("\n")
      .map((line) => line.match(/^([^:]+):\s*"?(.+?)"?$/))
      .filter(Boolean)
      .map((match) => [match[1].trim(), match[2].trim()])
  );
  const slug = fileName.replace(/\.md$/, "");
  const bullets = body
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .slice(0, 5)
    .map((line) => line.replace(/^- /, "").trim());
  return { ...data, slug, bullets };
};

const posts = readdirSync(insightsDir)
  .filter((file) => file.endsWith(".md"))
  .map(parsePost)
  .sort((a, b) => Number(a.order || 99) - Number(b.order || 99));

const geoPosts = posts.filter((post) => post.category === "GEO Guide");

if (!existsSync(outputDir)) mkdirSync(outputDir);

const calendarRows = [
  "week,source_slug,website_url,post_1,post_2,post_3,approval_status",
  ...geoPosts.map((post, index) => {
    const week = index + 1;
    const url = `${siteUrl}/insights/${post.slug}/`;
    return [
      week,
      post.slug,
      url,
      "professional-social-authority-post",
      "wechat-short-essay",
      "zalo-contact-note",
      "needs human approval"
    ].join(",");
  })
];

const socialDrafts = geoPosts
  .map((post, index) => {
    const url = `${siteUrl}/insights/${post.slug}/`;
    const bullets = post.bullets.length > 0 ? post.bullets : [
      "Define the real activity.",
      "Check the decision gates.",
      "Sequence money, site, advisers, and operating control before action."
    ];

    return `## Week ${index + 1}: ${post.title}

Source page: ${url}

### Professional Social Post

${post.title}

Most founders want the quick answer.

The better answer is the sequence:

${bullets.slice(0, 3).map((bullet) => `- ${bullet}`).join("\n")}

The goal is not paperwork. The goal is fewer expensive surprises before Vietnam becomes a moving project.

Read the guide: ${url}

CTA: Send "Vietnam Entry" through WhatsApp, WeChat, or Zalo if you want a Reality Check.

### WeChat Short Essay

Title: ${post.title}

Foreign founders often ask for the final answer too early. The better question is what must be confirmed before the first commitment.

Use the guide as a decision screen. It is not legal advice; it is a way to prepare better questions for lawyers, tax advisers, banks, landlords, partners, and local operators.

Read: ${url}

CTA: Add Les on WeChat and send your activity, target city, current stage, and next decision.

### Zalo Contact Note

Vietnam entry question this week: ${post.title}

If the decision involves site, license, capital, partner, or first-100-days control, write down the gate before taking the action.

Guide: ${url}

CTA: Add Les on Zalo and send the decision you are trying to make next.
`;
  })
  .join("\n---\n\n");

const workflow = `# Automated Content Workflow

This workflow keeps publishing human-approved and repeatable.

1. Publish one source-of-truth insight page.
2. Run \`npm run content:drafts\`.
3. Review \`content-output/social-drafts.md\`.
4. Edit for current facts, tone, and platform fit.
5. Approve manually before posting anywhere.
6. Track replies, QR adds, consultation requests, and page visits.
7. Feed the best questions back into the next insight page.

Never automate direct messages, comments, replies, or personal-account posting without human review.
`;

writeFileSync(join(outputDir, "content-calendar.csv"), `${calendarRows.join("\n")}\n`);
writeFileSync(join(outputDir, "social-drafts.md"), socialDrafts);
writeFileSync(join(outputDir, "workflow.md"), workflow);

console.log(`Generated ${geoPosts.length} weeks of content drafts in content-output.`);
