# Security Policy

## Scope

This repository contains a static Astro website. Public content, social links, QR codes, and `PUBLIC_*` build values are expected to be visible in the published site. Credentials, private API keys, passwords, access tokens, signing keys, and personal data are not.

## Secret handling

- Keep local secrets in untracked `.env` files or in Netlify and GitHub Actions environment settings.
- Use `.env.example` as the safe template. Never commit a populated `.env` file.
- Treat every Astro `PUBLIC_*` variable as public because it is bundled into the browser output.
- Do not put customer enquiries, subscriber exports, private messages, or unpublished source material in this repository.
- Do not place secrets in GitHub issues, pull requests, build logs, or commit messages.

## Reporting a problem

Do not open a public issue for a suspected credential or other sensitive disclosure. Use GitHub's private security reporting flow for the repository, or contact the site owner through the published contact channels. Include the affected path, commit or deployment reference, and the minimum evidence needed to reproduce the concern.

If a credential may have been exposed, revoke or rotate it first, then remove it from the working tree and history as appropriate. Removing a file from the latest commit does not invalidate a credential that was already published.

## Automated checks

Run these before pushing:

```bash
npm run check:security
npm audit --audit-level=high
npm run build
```
