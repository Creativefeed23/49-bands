# 49 Bands — working notes

Static invitation site for a 49th birthday gig. No build step, no framework
tooling. Deployed to Cloudflare Workers from `main`; every push goes live.

## How the site is built

`index.html` is the whole site — markup, inline styles and logic in one file.
`support.js` is the runtime that renders it. Do not restructure either.

Styling is **inline only**. There are no CSS classes and no stylesheet. Match
the inline style conventions already in the file.

## The grid

A 7×7 grid of 49 tiles. Each tile flips on click; tiles with a band reveal the
logo, then open a panel with the gig details. Empty tiles show "?" and let
visitors suggest a band.

Bands are defined in one array near the bottom of `index.html`:

```js
const BANDS = [
  { i: 20, key: 'magicdirt', photo: 'photos/magicdirt.jpg', name: 'Magic Dirt', no: 13, date: 'Sat 6 Mar 2027', venue: 'Adelaide Entertainment Centre' }
];
```

| Field | Meaning |
| --- | --- |
| `i` | Tile position, **0-indexed**. Tile 21 on screen is `i: 20`. |
| `key` | Logo filename in `logos/`, without `.png`. |
| `photo` | Path to the photo, with extension. |
| `no` | Running tally of bands locked in. Next number after the current highest. Not chronological — grid position and gig date are unrelated to it. |
| `date` | Format: `Sat 6 Mar 2027`. |
| `venue` | Venue and city. |

## Adding a band

Requests will be brief — something like *"I've uploaded the images for
Puscifer, add to tile 34 for 4 Dec 2026"*. Work the rest out yourself using
the rules below. Don't ask for anything you can derive.

**Finding the images.** Look in `logos/` and `photos/` for a file matching the
band name, lowercased with spaces and punctuation stripped — Puscifer →
`puscifer`, Guns N' Roses → `gunsnroses`. The logo is the one in `logos/`
(always `.png`); the photo is the one in `photos/` (any of `.jpg`, `.jpeg`,
`.png`, `.webp`, `.avif`). Set `key` to that basename and `photo` to the full
path including extension. If either file is missing, stop and say which one —
never add an entry pointing at a file that isn't there.

**Tile number.** The number given is the on-screen tile, 1–49. Subtract one for
`i`. Tile 34 → `i: 33`. If that tile is already taken, stop and say so.

**`no`.** Highest existing `no` plus one. Nothing more to it.

**Date.** Format as `Fri 4 Dec 2026` — three-letter weekday, day, three-letter
month, four-digit year. Work out the weekday from the date; don't ask for it.
If the year is ambiguous or looks wrong (a date in the past, or before the
other gigs), confirm before committing.

**Venue.** If not given, ask. Never invent one. If only a city is given and
other bands play a known venue there on the same date, suggest it and confirm.

**Then:** add one row to `BANDS`, matching the column alignment of the rows
around it. Change nothing else in the file.

When done, report back in one line: band, tile, date, venue — so the details
can be checked at a glance.

## Logos

Some logos are dark and need a white variant on the dark tiles — see
`logos/johnbutler-white.png`. If a new logo reads poorly, flag it rather than
editing the image.

## Suggestion form

Posts to Formspree (`https://formspree.io/f/xnpqalzb`). Requires http/https;
it does not work from `file://`.

## Git workflow

Commit directly to `main` and push. Do not create a branch or open a pull
request. This is a small static site with one maintainer; the PR step is
unnecessary friction. Every push to `main` deploys to the live site, so make
sure the change is complete before committing.

## Deploy config

`wrangler.jsonc` serves the repo root as static assets. `.assetsignore` keeps
`.git`, the README and config files out of the public deploy. Leave both alone
unless the deploy is broken.
