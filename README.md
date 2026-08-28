# 49 Bands

Static invitation site for the 49th birthday gig.
Hosted on Cloudflare Workers (static assets), deployed from this repo.

Live: https://49th.vitalogy.au

## Structure

```
index.html        the whole site (markup + inline styles + logic)
support.js        runtime that renders index.html
logos/            band logos (PNG, transparent)
photos/           band photos (webp / jpg / avif / png)
art/49.png        masthead
wrangler.jsonc    Cloudflare config — serves the repo root as static assets
.assetsignore     files excluded from the public deploy
```

## Deploying

Cloudflare Workers project `49-bands`, connected to this repo.

- Build command: *(none)*
- Deploy command: `npx wrangler deploy`
- Every push to `main` redeploys automatically, in about a minute.

## Adding a band

1. Drop the logo in `logos/` and the photo in `photos/`.
2. Add an entry to the `bands` list in `index.html` with tile number, name, date and venue.
3. Commit and push.

## Suggestion form

Posts to Formspree (`https://formspree.io/f/xnpqalzb`). Requires http/https —
it will not work opening `index.html` from disk.
