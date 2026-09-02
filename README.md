# Business Lens with Les

Static Astro site for **Business Lens with Les** and the provisional consulting practice **Business Lens Advisory**, co-founded by Les Xu and Jeffrey Zhang.

## Local commands

```bash
npm install
npm run build
npm run check:source
npm run check:site
npm run content:drafts
npm run content:youtube
npm run check:security
```

`npm run build` generates the sitemap before Astro builds the site. `npm run content:drafts` turns the published insight library into review-ready website, LinkedIn, X, newsletter, and short-video drafts. It never publishes content, sends DMs, or participates in communities automatically.

## Video library

`/watch` lists the YouTube channel automatically. A GitHub workflow checks the public YouTube feed every six hours, commits a changed video library, and Netlify publishes that update. The front-page featured video is intentionally separate and stays manually selected in `src/data/site.ts`.

## Newsletter and analytics setup

Set `PUBLIC_KIT_FORM_ACTION` to the Kit form action after creating a Business Lens Brief form with double opt-in and interest tags. Until then, the embedded form is captured by Netlify Forms.

Set `PUBLIC_GA_MEASUREMENT_ID` to activate GA4. Add Search Console and Bing verification tokens in the hosting configuration, then submit individual new public URLs with:

```bash
npm run indexnow:submit -- https://business-lens-with-les.netlify.app/insights/example/
```

The public IndexNow verification file is in `public/`. Add the site to Google Search Console and Bing Webmaster Tools manually; account verification cannot be completed in source code alone.

## Publishing boundaries

English is the live language. The site is structured so reviewed Mandarin pages can later live under `/zh/`; do not publish machine-translated pages without human review. Business Lens Advisory provides commercial, operational, and implementation support, not licensed legal, tax, financial, migration, or investment advice.

## Security

Never commit `.env` files, credentials, private keys, customer enquiries, subscriber exports, or unpublished source material. Use `.env.example` for the safe public-variable template, and store deployment values in Netlify or GitHub Actions settings. `npm run check:security` scans tracked files for sensitive-looking paths and common credential patterns; `npm audit --audit-level=high` checks the dependency tree. See [SECURITY.md](SECURITY.md) for the reporting and rotation procedure.

The repository also runs the secret scan and dependency audit in GitHub Actions. Run `npm run check:security` locally before pushing. GitHub repository administrators should enable secret scanning and push protection in the repository security settings.
