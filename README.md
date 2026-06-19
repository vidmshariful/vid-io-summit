# VID I/O Keynote — Building a Scalable Sales Process

A web-based, Google I/O–style keynote (reveal.js + GSAP), wrapped in a **Next.js** app so it
deploys cleanly on Vercel. The slide deck itself is a self-contained static site under
`public/deck/`; reveal.js, GSAP and the fonts are **vendored** (under `public/deck/vendor/` and
`public/deck/fonts/`) so it needs **no internet** on stage and never relies on `node_modules` at runtime.

## Project layout
- `public/deck/` — **the deck** (edit here): `index.html`, `css/`, `js/`, `fonts/`, `assets/`, `vendor/`.
- `app/`, `next.config.js` — the Next.js wrapper. `/` redirects to `/deck/index.html`.

## Run it locally
```bash
npm install
npm run dev      # Next dev server
```
Open **http://localhost:3000** (it redirects to the deck). Edit files in `public/deck/`.

## Deploy to Vercel
Push the repo to GitHub and import it in Vercel (it auto-detects Next.js — build `next build`,
no extra config), or run `vercel` from the CLI. The deck is served at `/deck/index.html` and `/`
redirects to it. Because the libraries are vendored under `public/`, nothing 404s on Vercel.

To regenerate the QR after deploy: `npm run qr -- "https://your-link"` (writes `public/deck/assets/qr.svg`).

## Presenting

**To present fullscreen:** click the **⛶ button** in the top-right corner, or press **F**.
It goes edge-to-edge automatically (exit with **Esc**). You can also force edge-to-edge any
time with **W**, or load `?fill` in the URL.

| Key | Action |
|-----|--------|
| **F** / ⛶ button | Fullscreen (fills the screen, Esc to exit) |
| **T** / ☾ button | Toggle **light / dark** theme (light is default) |
| **W** | Toggle edge-to-edge fill manually |

The deck is **light by default** with an animated **3D sales background** (three.js — drifting
deal cards, coins, growth bars, rings and nodes, with mouse parallax and a nudge on each slide
change). It falls back to a clean gradient if WebGL is unavailable. Pipelines show a busy board
where only the **new incoming leads** are highlighted; existing deals are washed back.
| **→ / ←** or remote | Next / previous (also advances click-builds) |
| **S** | Speaker view: your notes + next slide + timer (use on a second screen) |
| **Esc** | Slide overview grid |
| **B** | Black the screen |

## PDF backup (do this before the talk)

Open **http://localhost:8000/?print-pdf** and Print → Save as PDF. In `?print-pdf` mode all
motion is replaced by final states, so the export is clean. Keep the PDF as your offline fallback.

## Before you go on stage — swap in real assets

Drop files into `assets/` and update the matching slide in `index.html`:

- **Slide 2** founder photo, **Slide 6** meme, **Slide 7** home-office photo / old-office photo / studio video.
- **Slide 38 QR** — point it at your real snapshot link:
  ```bash
  npm run qr -- "https://your-real-snapshot-link"
  ```

## The two non-negotiables (already enforced)

1. The word **"HighLevel" never appears before slide 31** (the reveal). Every demo mockup is platform-neutral.
2. **No em dashes** in any on-slide text.

See `CLAUDE.md` for the full design system, cast, stage colors, and motion rules.
