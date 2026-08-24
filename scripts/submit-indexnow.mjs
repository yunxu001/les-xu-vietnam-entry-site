const siteUrl = "https://business-lens-with-les.netlify.app";
const key = process.env.INDEXNOW_KEY || "7b61d1d4ca1c4faab1e24f43e5ac2f0d";
const urlList = process.argv.slice(2);

if (urlList.length === 0) {
  throw new Error("Provide one or more public URLs: npm run indexnow:submit -- https://business-lens-with-les.netlify.app/insights/example/");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation: `${siteUrl}/${key}.txt`, urlList })
});

if (!response.ok) throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
console.log(`Submitted ${urlList.length} URL(s) to IndexNow.`);
