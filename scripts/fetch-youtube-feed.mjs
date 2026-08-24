import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(root, "content-output");
const channelId = "UCW1SCx6_phXf03LxTjEuB9A";
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

mkdirSync(outputDir, { recursive: true });
const response = await fetch(feedUrl, { headers: { "user-agent": "BusinessLensSite/1.0" } });
if (!response.ok) throw new Error(`YouTube feed request failed: ${response.status}`);
const xml = await response.text();
const entries = [...xml.matchAll(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link rel="alternate" href="([^"]+)"[\s\S]*?<published>([^<]+)<\/published>[\s\S]*?<\/entry>/g)].map((match) => ({ title: match[1].trim(), url: match[2], publishedAt: match[3] }));
writeFileSync(join(outputDir, "youtube-feed.json"), `${JSON.stringify({ fetchedAt: new Date().toISOString(), entries }, null, 2)}\n`);
console.log(`Saved ${entries.length} YouTube entries for editorial review.`);
