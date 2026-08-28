# 49 Bands

Static invitation site for the 49th birthday gig. Deployed to Cloudflare Pages.

## Structure

```
index.html      the whole site (markup + inline styles + logic)
support.js      runtime that renders index.html
logos/          band logos (PNG, transparent)
photos/         band photos (webp / jpg / avif / png)
art/            49.png masthead
```

## Deploying

Cloudflare Pages, connected to this repo.

- Build command: *(none)*
- Build output directory: `/`
- Every push to `main` publishes automatically.

## Adding a band

1. Drop the logo in `logos/` and the photo in `photos/`.
2. Add an entry to the `bands` list in `index.html` with tile number, name, date and venue.
3. Commit and push. Cloudflare rebuilds in about 20 seconds.

## Suggestion form

Posts to Formspree (`https://formspree.io/f/xnpqalzb`). Requires http/https —
it will not work opening `index.html` from disk.
