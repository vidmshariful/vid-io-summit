/* ============================================================
   VID I/O Keynote — Reveal init + GSAP motion
   One easing language (power3.out), 300-600ms, calm and confident.
   ============================================================ */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PRINT = /print-pdf/gi.test(window.location.search);
const FORCE_STILL = /[?&]still/gi.test(window.location.search);
// "still" = show final states, no entrance motion (PDF export, reduced-motion, or ?still).
const STILL = REDUCED || PRINT || FORCE_STILL;
const EASE = "power3.out";

// Fill-width mode: edge-to-edge, no margin, scales up to fill any screen.
// Start filled with ?fill in the URL; toggle live by pressing W.
let FILLED = /[?&]fill/gi.test(window.location.search);
const FILL_MARGIN = 0, NORMAL_MARGIN = 0.04, FILL_MAXSCALE = 6;
function applyFill() {
  Reveal.configure({ margin: FILLED ? FILL_MARGIN : NORMAL_MARGIN, maxScale: FILLED ? FILL_MAXSCALE : 2.0 });
}

// Show every count-up at its final value (used by still mode and as a safety net).
function settleAllCounts() {
  document.querySelectorAll(".snum[data-count]").forEach((el) => {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    el.textContent = prefix + (el.dataset.count || "0") + suffix;
  });
}

/* ---------- Reveal config ---------- */
Reveal.initialize({
  width: 1280,
  height: 720,
  margin: FILLED ? 0 : 0.04,
  minScale: 0.2,
  maxScale: FILLED ? 6 : 2.0,
  hash: true,
  history: true,
  controls: true,
  controlsTutorial: false,
  progress: true,
  slideNumber: false,
  center: false,
  transition: "fade",
  transitionSpeed: "default",
  backgroundTransition: "fade",
  autoAnimate: true,
  autoAnimateDuration: 0.7,
  autoAnimateEasing: "cubic-bezier(0.45,0,0.15,1)",
  fragments: true,
  fragmentInURL: true,
  pdfSeparateFragments: false,
  plugins: [RevealNotes],
});

/* ---------- fill-width toggle (press W) ---------- */
function flashToast(msg) {
  let t = document.getElementById("fill-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "fill-toast";
    t.style.cssText =
      "position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:60;" +
      "font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.08em;text-transform:uppercase;" +
      "color:#EAF1FF;background:rgba(10,20,40,.82);border:1px solid rgba(91,200,255,.35);" +
      "padding:10px 18px;border-radius:999px;backdrop-filter:blur(10px);opacity:0;transition:opacity .25s;pointer-events:none;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(t._h);
  t._h = setTimeout(() => (t.style.opacity = "0"), 1200);
}
Reveal.on("ready", () => applyFill());
Reveal.addKeyBinding(
  { keyCode: 87, key: "W", description: "Toggle fill-width (edge to edge)" },
  () => {
    FILLED = !FILLED;
    applyFill();
    flashToast(FILLED ? "Fill width: ON" : "Fill width: off");
  }
);

/* ---------- FULLSCREEN: clickable button + key, fills the screen edge to edge ---------- */
function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}
function toggleFullscreen() {
  const el = document.documentElement;
  if (!isFullscreen()) {
    (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document);
  }
}
function makeFsButton() {
  const b = document.createElement("button");
  b.id = "fs-btn";
  b.title = "Present fullscreen (F)";
  b.setAttribute("aria-label", "Toggle fullscreen");
  b.style.cssText =
    "position:fixed;bottom:24px;left:24px;z-index:60;width:46px;height:46px;display:flex;" +
    "align-items:center;justify-content:center;cursor:pointer;color:#9CC6FF;" +
    "background:rgba(10,20,40,.7);border:1px solid rgba(91,200,255,.30);border-radius:12px;" +
    "backdrop-filter:blur(10px);transition:all .2s;font-size:20px;line-height:1;";
  b.onmouseenter = () => { b.style.color = "#EAF1FF"; b.style.borderColor = "rgba(91,200,255,.6)"; };
  b.onmouseleave = () => { b.style.color = "#9CC6FF"; b.style.borderColor = "rgba(91,200,255,.30)"; };
  const paint = () => (b.innerHTML = isFullscreen() ? "&#10005;" : "&#9974;");
  paint();
  b.onclick = toggleFullscreen;
  document.body.appendChild(b);
  return paint;
}
// when entering/leaving fullscreen, fill the screen edge to edge automatically
if (!PRINT) {
  const paintFs = makeFsButton();
  const onFsChange = () => { paintFs(); FILLED = isFullscreen(); applyFill(); };
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);
}

/* ---------- helpers ---------- */
function q(scope, sel) {
  return Array.from(scope.querySelectorAll(sel));
}

function countUp(el) {
  const target = parseFloat(el.dataset.count || "0");
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  if (STILL) {
    el.textContent = prefix + target + suffix;
    return;
  }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 0.8,
    ease: "power2.out",
    onUpdate() {
      el.textContent = prefix + Math.round(obj.v) + suffix;
    },
  });
}

/* play a fresh timeline for the slide that just landed */
function animateSlide(slide) {
  if (!slide || STILL) {
    // still mode: no entrance motion, just guarantee final states everywhere
    settleAllCounts();
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.5 } });
  const isAutoAnimate = slide.hasAttribute("data-auto-animate");

  /* headline + kicker entrance (every slide) */
  const kicker = slide.querySelector(".kicker");
  const head = slide.querySelector("h1, h2, h3");
  if (kicker) tl.from(kicker, { y: 14, opacity: 0, duration: 0.4 }, 0);
  if (head) tl.from(head, { y: 22, opacity: 0, duration: 0.55 }, 0.05);

  /* brand key phrase gets a brief glow (filter works on gradient text) */
  const vphrase = slide.querySelector("h1 .v, h2 .v, h3 .v");
  if (vphrase) {
    tl.fromTo(
      vphrase,
      { filter: "drop-shadow(0 0 0px rgba(45,127,255,0))" },
      { filter: "drop-shadow(0 0 28px rgba(45,127,255,0.55))", duration: 0.5 },
      0.35
    ).to(vphrase, { filter: "drop-shadow(0 0 14px rgba(45,127,255,0.32))", duration: 0.6 }, 0.85);
  }

  const sub = slide.querySelector(".sub");
  if (sub) tl.from(sub, { y: 14, opacity: 0, duration: 0.45 }, 0.25);

  /* ---- dark component system (Parts 2-5) ---- */
  const stg = (sel, vars, at, stagger) => {
    const els = q(slide, sel);
    if (els.length) tl.from(els, { duration: 0.45, stagger: stagger, ...vars }, at);
  };
  stg(".schip", { y: 10, opacity: 0 }, 0.1, 0.05);
  stg(".job", { y: 20, opacity: 0 }, 0.2, 0.08);
  stg(".teach .row", { x: 16, opacity: 0 }, 0.32, 0.12);
  stg(".tcard", { y: 22, opacity: 0 }, 0.2, 0.12);
  stg(".lc", { y: 16, opacity: 0, scale: 0.97 }, 0.2, 0.045);
  stg(".pcol", { y: 16, opacity: 0 }, 0.2, 0.055);
  stg(".wfn", { y: 16, opacity: 0 }, 0.2, 0.08);
  stg(".wfc", { opacity: 0, scale: 0.6 }, 0.34, 0.08);
  stg(".sysc", { y: 18, opacity: 0 }, 0.2, 0.07);
  stg(".wli", { y: 12, opacity: 0 }, 0.18, 0.04);
  stg(".stat", { y: 16, opacity: 0 }, 0.2, 0.05);
  stg(".scrnote, .mcap", { opacity: 0, y: 8 }, 0.6, 0);
  /* reveal slide */
  const pills2 = q(slide, ".pill2");
  if (pills2.length) tl.from(pills2, { y: -16, opacity: 0, scale: 0.9, stagger: 0.04, duration: 0.4 }, 0.1);
  const revwm = slide.querySelector(".revwm");
  if (revwm) {
    tl.fromTo(revwm, { scale: 0.9, opacity: 0, filter: "drop-shadow(0 0 0 rgba(61,123,255,0))" },
      { scale: 1, opacity: 1, filter: "drop-shadow(0 0 55px rgba(61,123,255,0.6))", duration: 0.7 }, 0.45)
      .to(revwm, { filter: "drop-shadow(0 0 30px rgba(61,123,255,0.4))", duration: 0.8 }, 1.15);
  }

  /* journey chips + media frames (slide 7) */
  const chips = q(slide, ".chip");
  if (chips.length) tl.from(chips, { y: 16, opacity: 0, stagger: 0.07, duration: 0.4 }, 0.25);
  const frames = q(slide, ".frame");
  if (frames.length) tl.from(frames, { y: 24, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.35);

  /* employee cards (slide 11) */
  const emps = q(slide, ".empcard");
  if (emps.length) tl.from(emps, { y: 26, opacity: 0, stagger: 0.1, duration: 0.5 }, 0.2);

  /* role flow / strips / tool grids / workflow / hub */
  const flowNodes = q(slide, ".flow > *");
  if (flowNodes.length) tl.from(flowNodes, { y: 18, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.2);

  const strips = q(slide, ".strip");
  if (strips.length) {
    tl.from(strips, { y: 22, opacity: 0, stagger: 0.12, duration: 0.5 }, 0.2);
    tl.from(q(slide, ".stg"), { scale: 0.9, opacity: 0, stagger: 0.03, duration: 0.3 }, 0.4);
  }

  const tools = q(slide, ".tool");
  if (tools.length) tl.from(tools, { y: 20, opacity: 0, stagger: 0.05, duration: 0.4 }, 0.25);

  const wnodes = q(slide, ".wnode");
  if (wnodes.length) {
    tl.from(wnodes, { y: 16, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.2);
    tl.from(q(slide, ".wedge"), { scaleY: 0, transformOrigin: "top", stagger: 0.08, duration: 0.25 }, 0.3);
  }

  const hub = slide.querySelector(".hub");
  if (hub) {
    tl.from(slide.querySelectorAll(".hub .sl"), { x: -14, opacity: 0, stagger: 0.05, duration: 0.35 }, 0.2);
    tl.from(slide.querySelectorAll(".hub .crow"), { x: 14, opacity: 0, stagger: 0.05, duration: 0.35 }, 0.3);
  }

  /* pipeline boards: cards cascade in (skip when auto-animate owns the morph) */
  const boardCards = q(slide, ".board .card");
  if (boardCards.length && !isAutoAnimate) {
    tl.from(slide.querySelector(".mock"), { y: 24, opacity: 0, duration: 0.45 }, 0.15);
    tl.from(slide.querySelectorAll(".board .col-h"), { opacity: 0, y: 8, stagger: 0.03, duration: 0.3 }, 0.3);
    tl.from(boardCards, { y: 12, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.35);
  }

  /* capture slide (12): channel, arrow, card per column in sequence */
  if (slide.querySelector(".capcols") && !isAutoAnimate) {
    const cols = q(slide, ".capcol");
    cols.forEach((col, i) => {
      const base = 0.2 + i * 0.28;
      const chan = col.querySelector(".capchan");
      const arrow = col.querySelector(".cap-arrow");
      const card = col.querySelector(".card");
      if (chan) tl.from(chan, { y: 20, opacity: 0, duration: 0.4 }, base);
      if (arrow) tl.from(arrow, { opacity: 0, scaleX: 0.5, transformOrigin: "center", duration: 0.3 }, base + 0.18);
      if (card) tl.from(card, { y: 14, opacity: 0, scale: 0.92, duration: 0.4 }, base + 0.32);
    });
  }

  /* notification slides (14, 18): slide down and settle one by one */
  const notis = q(slide, ".noti");
  if (notis.length) {
    const phone = slide.querySelector(".phone");
    if (phone) tl.from(phone, { y: 30, opacity: 0, duration: 0.5 }, 0.15);
    tl.from(slide.querySelector(".lk-time"), { opacity: 0, y: -10, duration: 0.4 }, 0.3);
    tl.from(notis, { y: -22, opacity: 0, stagger: 0.12, duration: 0.45 }, 0.45);
  }

  /* inbox slides (15, 27): panes fade left to right, then bubbles */
  if (slide.querySelector(".inbox")) {
    tl.from(slide.querySelectorAll(".inbox .pane"), { x: 24, opacity: 0, stagger: 0.12, duration: 0.45 }, 0.2);
    tl.from(slide.querySelectorAll(".inbox .conv"), { opacity: 0, x: -10, stagger: 0.05, duration: 0.3 }, 0.4);
    tl.from(slide.querySelectorAll(".bub"), { y: 12, opacity: 0, stagger: 0.1, duration: 0.4 }, 0.6);
    tl.from(slide.querySelectorAll(".act"), { opacity: 0, x: 10, stagger: 0.08, duration: 0.35 }, 0.7);
  }

  /* email list (17) */
  const mails = q(slide, ".mail");
  if (mails.length) {
    tl.from(slide.querySelector(".maillist"), { y: 22, opacity: 0, duration: 0.45 }, 0.15);
    tl.from(mails, { y: 14, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.3);
  }

  /* dashboard (20): count up */
  const nums = q(slide, ".snum[data-count]");
  if (nums.length) {
    tl.from(slide.querySelectorAll(".stat"), { y: 18, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.2);
    tl.add(() => nums.forEach(countUp), 0.4);
  }

  /* reveal (31): pills converge, then wordmark scales with glow */
  const pills = q(slide, "[data-pill]");
  if (pills.length) {
    tl.from(pills, { y: -26, opacity: 0, scale: 0.9, stagger: 0.05, duration: 0.4 }, 0.1);
    const wm = slide.querySelector(".wordmark");
    if (wm) {
      tl.fromTo(
        wm,
        { scale: 0.9, opacity: 0, filter: "drop-shadow(0 0 0px rgba(45,127,255,0))" },
        { scale: 1, opacity: 1, filter: "drop-shadow(0 0 55px rgba(45,127,255,0.6))", duration: 0.7, ease: "power3.out" },
        0.5
      ).to(wm, { filter: "drop-shadow(0 0 30px rgba(45,127,255,0.4))", duration: 0.8 }, 1.2);
    }
  }

  /* QR (38) */
  const qr = slide.querySelector(".qr-card");
  if (qr) tl.from(qr, { scale: 0.92, opacity: 0, duration: 0.5 }, 0.2);

  /* big stat number */
  const big = slide.querySelector(".bignum");
  if (big) tl.from(big, { scale: 0.9, opacity: 0, duration: 0.5 }, 0.2);
}

/* ---------- fit dense mockups to the available area (safety net) ---------- */
function fitSlide(slide) {
  if (!slide) return;
  const area = slide.querySelector(".head-then-mock .stage");
  if (!area) return;
  const content = area.firstElementChild;
  if (!content) return;
  content.style.transform = "";
  // protect the auto-animate morph (slides 12 and 13): never rescale those
  if (slide.hasAttribute("data-auto-animate")) return;
  const pad = 6;
  const sH = (area.clientHeight - pad) / content.offsetHeight;
  const sW = (area.clientWidth) / content.offsetWidth;
  const scale = Math.min(1, sH, sW);
  if (scale < 0.999) {
    content.style.transformOrigin = "center center";
    content.style.transform = "scale(" + scale + ")";
  }
}

/* ---------- theme toggle (T or button): light <-> dark ---------- */
function applyTheme(dark) {
  document.body.classList.toggle("theme-dark", dark);
  if (window.bg3d) window.bg3d.setTheme(dark ? "dark" : "light");
}
if (!PRINT) {
  const tb = document.createElement("button");
  tb.id = "theme-btn";
  tb.title = "Toggle light / dark (T)";
  tb.style.cssText =
    "position:fixed;bottom:26px;left:82px;z-index:60;width:42px;height:42px;display:flex;align-items:center;" +
    "justify-content:center;cursor:pointer;font-size:17px;border-radius:11px;backdrop-filter:blur(10px);transition:all .2s;";
  const paintTb = () => {
    const dark = document.body.classList.contains("theme-dark");
    tb.innerHTML = dark ? "&#9728;" : "&#9789;"; // sun when dark (to go light), moon when light
    tb.style.color = dark ? "#9CC6FF" : "#2F6BFF";
    tb.style.background = dark ? "rgba(10,20,40,.6)" : "rgba(255,255,255,.7)";
    tb.style.border = "1px solid " + (dark ? "rgba(91,200,255,.3)" : "rgba(16,32,74,.14)");
  };
  paintTb();
  tb.onclick = () => { applyTheme(!document.body.classList.contains("theme-dark")); paintTb(); };
  document.body.appendChild(tb);
  Reveal.addKeyBinding({ keyCode: 84, key: "T", description: "Toggle light / dark theme" }, () => {
    applyTheme(!document.body.classList.contains("theme-dark")); paintTb();
  });
}

/* ---------- top part-indicator bar ---------- */
const PARTS = { "1": "Part 1", "2": "Part 2", "3": "Part 3", "4": "Part 4", "5": "Part 5" };
let tbPart, tbCount;
if (!PRINT) {
  const bar = document.createElement("div");
  bar.id = "topbar";
  bar.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:55;display:flex;justify-content:space-between;align-items:center;" +
    "padding:18px 42px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.14em;" +
    "text-transform:uppercase;color:var(--muted-2);pointer-events:none;";
  bar.innerHTML =
    "<div id='tb-part' style='color:var(--blue);text-transform:none;letter-spacing:.06em;font-weight:500'></div>" +
    "<div id='tb-count'></div>";
  document.body.appendChild(bar);
  tbPart = bar.querySelector("#tb-part");
  tbCount = bar.querySelector("#tb-count");
}
function updateBar(slide) {
  if (!tbPart || !slide) return;
  const p = slide.getAttribute("data-part") || "1";
  tbPart.textContent = PARTS[p] || "";
  const total = Reveal.getTotalSlides();
  const idx = Reveal.getIndices().h + 1;
  tbCount.innerHTML = "<b style='color:#EDF2FB;font-weight:500'>" + idx + "</b> / " + total;
}

/* ---------- cover: self-running pipeline conveyor ---------- */
function coverFlow() {
  const wrap = document.getElementById("fb-cards");
  if (!wrap) return () => {};
  const NAMES = [
    ["Olivia B.", "Explainer"], ["Marcus R.", "SaaS demo"], ["Priya S.", "Discovery"],
    ["David C.", "Onboarding"], ["Sarah L.", "Launch"], ["James O.", "Feature"],
    ["Elena R.", "Brand"], ["Tomas V.", "Editing"], ["Nina R.", "Recruiting"],
  ];
  const COLS = 4, colW = 25, rowH = 62;
  let cards = [], ni = 0, timer = null, alive = true;
  const mk = (col) => {
    const [nm, svc] = NAMES[ni++ % NAMES.length];
    const el = document.createElement("div");
    el.className = "fcard" + (col === 0 ? " new" : "") + (col === COLS - 1 ? " won" : "");
    el.innerHTML = "<b>" + nm + "</b><span>" + svc + "</span>";
    wrap.appendChild(el);
    return { el, col };
  };
  const layout = (animate) => {
    const slot = {};
    cards.forEach((c) => { const s = slot[c.col] || 0; slot[c.col] = s + 1; c.slot = s; });
    cards.forEach((c) => {
      const x = c.col * colW + 1, y = c.slot * rowH;
      if (animate && window.gsap) gsap.to(c.el, { left: x + "%", top: y + "px", duration: 0.7, ease: "power3.inOut" });
      else { c.el.style.left = x + "%"; c.el.style.top = y + "px"; }
    });
  };
  function tick() {
    if (!alive) return;
    for (let i = cards.length - 1; i >= 0; i--) {
      const c = cards[i];
      c.col++;
      c.el.classList.remove("new");
      if (c.col === COLS - 1) c.el.classList.add("won");
      if (c.col >= COLS) {
        const el = c.el;
        if (window.gsap) gsap.to(el, { opacity: 0, duration: 0.5, delay: 0.35, onComplete: () => el.remove() });
        else el.remove();
        cards.splice(i, 1);
      }
    }
    const nc = mk(0);
    cards.unshift(nc);
    if (window.gsap) gsap.fromTo(nc.el, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.45 });
    layout(true);
  }
  // seed an initial spread across the board
  [COLS - 1, 2, 1, 0].forEach((col) => cards.push(mk(col)));
  layout(false);
  if (STILL) return () => {};
  timer = setInterval(tick, 1900);
  return () => { alive = false; clearInterval(timer); wrap.innerHTML = ""; cards = []; };
}
let coverStop = null;
function handleCover() {
  const isCover = Reveal.getIndices().h === 0;
  if (isCover && !coverStop) coverStop = coverFlow();
  else if (!isCover && coverStop) { coverStop(); coverStop = null; }
}

/* ---------- wire up ---------- */
Reveal.on("ready", (e) => {
  fitSlide(e.currentSlide);
  animateSlide(e.currentSlide);
  updateBar(e.currentSlide);
  handleCover();
});
Reveal.on("slidechanged", (e) => {
  fitSlide(e.currentSlide);
  animateSlide(e.currentSlide);
  updateBar(e.currentSlide);
  handleCover();
});
window.addEventListener("resize", () => fitSlide(Reveal.getCurrentSlide()));

/* replay fragment-free; keep ambient drift alive */
function ambientDrift() {
  if (STILL) return;
  q(document, ".ambient").forEach((a) => {
    gsap.to(a, {
      xPercent: 6,
      yPercent: -4,
      duration: 14,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
}
window.addEventListener("load", ambientDrift);
