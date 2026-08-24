import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(root, "content-output");
const channelId = "UCW1SCx6_phXf03LxTjEuB9A";
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const outputFile = join(outputDir, "youtube-feed.json");

const decodeHtml = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

const findTag = (entry, tag) => entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() || "";
const normalizeTitle = (title) => title.replace(/\?business lens(?:\s+.*)?$/i, "?").trim();

mkdirSync(outputDir, { recursive: true });

try {
  const response = await fetch(feedUrl, { headers: { "user-agent": "BusinessLensSite/1.0" } });
  if (!response.ok) throw new Error(`YouTube feed request failed: ${response.status}`);

  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
    const entry = match[1];
    const id = findTag(entry, "yt:videoId");
    const url = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] || `https://www.youtube.com/watch?v=${id}`;
    const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    return {
      id,
      title: normalizeTitle(decodeHtml(findTag(entry, "title"))),
      url,
      thumbnail,
      publishedAt: findTag(entry, "published"),
      updatedAt: findTag(entry, "updated")
    };
  }).filter((entry) => entry.id && entry.title);

  writeFileSync(outputFile, `${JSON.stringify({ channelId, fetchedAt: new Date().toISOString(), entries }, null, 2)}\n`);
  console.log(`Saved ${entries.length} YouTube entries for website and editorial review.`);
} catch (error) {
  if (!existsSync(outputFile)) throw error;
  console.warn(`YouTube feed unavailable. Keeping the cached video list: ${error.message}`);
}
