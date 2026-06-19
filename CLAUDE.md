# VID I/O Keynote — "Building a Scalable Sales Process"

Web-based keynote deck (reveal.js + GSAP), Google I/O stage style. 39 slides, 16:9, dark
cinematic canvas with light CRM mockups floating on top. Speaker: Shariful Islam, Vidiosa.

## Run it
- `npm start` then open http://localhost:8000  (uses python3, works offline)
- Present: **F** fullscreen, arrows / remote to navigate, **S** speaker view (notes + timer + next),
  **Esc** slide overview, **B** blackout.
- PDF backup: open `http://localhost:8000/?print-pdf` then Print to PDF.
- Everything is vendored locally (reveal.js, GSAP, fonts) so it needs no internet on stage.

## Files
- `index.html` — all 39 slides as `<section>`s, each with `<aside class="notes">` speaker notes.
- `css/theme.css` — the dark slide canvas + typography (the design system).
- `css/mockups.css` — the light CRM mockup kit (cards, boards, phones, inbox, dashboard...).
- `js/animations.js` — Reveal config + GSAP motion (runs per slide on `slidechanged`).
- `assets/qr.svg` — QR on slide 38. Regenerate: `npm run qr -- "https://your-snapshot-link"`.

## Structure — 5 parts, with the FOUR JOBS as the spine (see talk-context.md)
The talk teaches one portable model — a sales process does four jobs: **Capture, Route, Move
forward, Report** — then proves each in the demo, then recalls it. That spine is visible as the
`.strip` chip row on every demo slide (the active job highlighted) and as the `.jobs` anchor grid.
- **Part 1 — The Reframe** (cover + cold open + hook + reframe + tease + intro). Kept from earlier.
- **Part 2 — The Principle**: name the four jobs, then one teach slide per job (Most founders → The fix).
- **Part 3 — The Demo** (Magic Motion Production): capture 8 leads → pipeline → route workflow →
  board moves → nurture/handoff/no-show/proposal workflows → report dashboard. Each maps to a job.
  Workflow slides carry a `.scrnote` placeholder for the real (platform-cropped) screenshot.
- **Part 4 — The Full System + reveal**: front-of-house, the engine (workflow list), everything else,
  then the cold reveal: HighLevel.
- **Part 5 — The Payoff**: callback, "works on whatever you use", one Monday action, the free QR, close.
Emotional target: **capability, not awe.** Clarity beats drama.

## Design tokens (Vid I/O dark-blue, reference palette)
- Canvas bg `#070B14`; surfaces `#111A2E` / `#0F1726`; text `#EDF2FB`; muted `#8794AE`/`#586079`.
- Accent electric blue `#3D7BFF`, bright `#5B9DFF`, cyan `#63B6FF`; gradient `linear-gradient(100deg,#3D7BFF,#63B6FF)`.
  Lines `rgba(90,150,255,.16)` / `.34`. Key phrases use the blue gradient (`.v`). Status green `#34D399`, amber `#F6B23D`, rose `#FB7185`.
- All mockups are **dark surfaces** (no white/light app screens). Components live in `css/mockups.css`:
  `.jobs`/`.job`, `.strip`/`.schip`, `.teach`, `.lgrid`/`.lc`, `.pipe`/`.pcol`/`.pcd`, `.wf`/`.wfn`,
  `.sysg`/`.sysc`, `.wlist`/`.wli`, `.tcard`, `.dash`/`.stat`, `.rev`/`.revwm`, `.qrcard`.
- Fonts: Space Grotesk 600 (headlines), Inter (body), JetBrains Mono (labels). Headlines use `text-wrap:balance`.
- Top bar shows the current part + slide count (driven by each section's `data-part`).
- Pipeline stage colors: New `#64748B`, Contacted `#3B82F6`, Engaged `#14B8A6`, Qualified `#F6B23D`,
  Call Booked `#F97316`, Nurture `#8B5CF6`, Disqualified `#9AA3B5`; closer Booked `#F97316`, Showed
  `#14B8A6`, No-Show `#FB7185`, Proposal `#F6B23D`, Negotiation `#6366F1`, Won `#22C55E`, Lost `#DC2626`.

## Pipeline stage colors
- Setter: New Lead `#64748B`, Contacted `#3B82F6`, Engaged `#14B8A6`, Qualified `#F59E0B`,
  Call Booked `#F97316`, Nurture `#8B5CF6`, Disqualified `#D08A9B`.
- Closer: Booked `#F97316`, Showed `#14B8A6`, No-Show `#FB7185`, Proposal Sent `#F59E0B`,
  In Negotiation `#6366F1`, Won `#22C55E`, Lost `#DC2626`.

## Fixed cast (identical everywhere)
- Team: **Aria Nolan** (the Setter), **Daniel Cole** (the Closer).
- Leads: **Olivia Bennett** (Instagram, explainer, 9:12 AM),
  **Marcus Reid** (live chat, SaaS demo, 12:47 AM after hours),
  **Priya Shah** (direct booking, Thu 2:00 PM).
- Demo company: **Magic Motion Production**. Never attach a real owner name to it.
  Speaker is presented only as Vidiosa.

## Hard rules (never break)
1. **Cold reveal:** the word "HighLevel" must NOT appear before slide 31. All demo mockups are
   platform-neutral (no product name, logo, or identifying chrome). It appears only on slide 31+.
2. **No em dashes** in any on-slide text. Use periods, commas, or colons.
3. One accent hue per slide, paired with a label.

## Motion principles
- One easing language: `power3.out`. Durations 300-600ms. Subtle, never bouncy.
- Stagger entrances 40-80ms. Morph the shared element (auto-animate). Motion serves meaning.
- The key morph: the 3 lead cards on slide 12 auto-animate into the setter pipeline on slide 13
  (matched via `data-id="lead-olivia|marcus|priya"`).
- `prefers-reduced-motion` disables all motion and shows final states.

## Replace before the talk (drop into assets/, then reference in index.html)
- Slide 2 founder photo, slide 6 meme, slide 7 home-office photo / old-office photo / studio video.
- Slide 38 QR: point it at the real snapshot share link with `npm run qr -- "<link>"`.
