# Pets Friend — B2B wholesale frontend

Static Next.js 15 site (`output: 'export'`) built for Netlify. Content lives in `content/*.json`.

## Run locally
```
npm install
npm run dev          # http://localhost:3000
npm run build        # writes static site to out/
npm run check        # verifies pages, links, JSON-LD, sitemap
```

## Put it on GitHub and Netlify
1. Create an empty GitHub repo, then:
   `git remote add origin <repo-url> && git branch -M main && git push -u origin main`
2. Netlify > Add new site > Import from Git > pick the repo.
   Build command `npm run build`, publish directory `out` (already set in `netlify.toml`).
3. Site settings > Environment variables: set `SITE_URL` to the final domain (e.g. `https://yourdomain.com`), then redeploy.
   Until it is set, canonicals, sitemap and llms.txt use the Netlify URL.
4. Forms: after the first deploy, Netlify > Forms shows `trade-application` and `quote-request`. Add email notifications there.
5. Old-site redirects: add rows to `content/redirects.json` (`[{"from":"/old","to":"/new","status":301}]`) or to `scripts/build-redirects.mjs`.

## What generates itself
Add a collection, product, brand, blog post or CMS page in `content/*.json` and the next build creates its URL, sitemap entry, llms.txt line, JSON-LD and breadcrumbs.

## Placeholders to fill before launch
Search the repo for `[TRADE PHONE]`, `[STANDARD DAYS]`, `[EXPRESS DAYS]` and replace with real values (GSTIN, address and policy pages are in `content/pages.json`).
Checkout is in test mode: no payment is taken until PayU is connected.
