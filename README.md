# VID I/O Keynote — Building a Scalable Sales Process

A web-based, Google I/O–style keynote deck. 39 slides, dark cinematic canvas with light CRM
mockups, smooth auto-animate morphs and GSAP motion. Built with reveal.js + GSAP.
Everything (engine, fonts) is vendored locally, so it runs with **no internet** on stage.

## Run it

```bash
npm start
```

Then open **http://localhost:8000**.

(That's just `python3 -m http.server 8000`. You can also open `index.html` directly, but the
local server is more reliable for the speaker-notes window.)

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
