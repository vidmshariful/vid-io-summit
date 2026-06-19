/* ============================================================
   3D sales-themed background (three.js, ESM).
   Floating deal cards, coins, growth bars, rings and nodes that
   drift with gentle motion + mouse parallax. Theme-aware.
   Fails silently to the CSS gradient if WebGL is unavailable.
   ============================================================ */
import * as THREE from "../node_modules/three/build/three.module.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("bg3d");
let api = { setTheme() {}, pulse() {} };
window.bg3d = api;

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const PAL = {
    light: { fog: 0xeaeff7, colors: [0x2f6bff, 0x5b9dff, 0x8fbcff, 0x2ba0ff, 0xc8dcff], emissive: 0x0a2a6a, ei: 0.12, op: 0.92, hemi: [0xffffff, 0xcdd8ee, 1.05], dir: 1.1 },
    dark:  { fog: 0x070b14, colors: [0x3d7bff, 0x5b9dff, 0x63b6ff, 0x2f6bff, 0x9cc2ff], emissive: 0x1b3aa0, ei: 0.55, op: 0.95, hemi: [0x6f8fd0, 0x0a1020, 0.7], dir: 0.9 },
  };
  let theme = document.body.classList.contains("theme-dark") ? "dark" : "light";

  const hemi = new THREE.HemisphereLight(0xffffff, 0xcdd8ee, 1.05);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(-4, 6, 6);
  scene.add(dir);
  const fog = new THREE.FogExp2(PAL[theme].fog, 0.05);
  scene.fog = fog;

  // geometry pool — abstract sales motifs
  const geos = [
    new THREE.IcosahedronGeometry(0.7, 0),                    // node
    new THREE.TorusGeometry(0.6, 0.2, 16, 40),               // cycle/ring
    new THREE.CylinderGeometry(0.55, 0.55, 0.16, 36),        // coin
    new THREE.BoxGeometry(0.9, 0.62, 0.1),                   // deal card
    new THREE.SphereGeometry(0.5, 24, 24),                   // node
    new THREE.ConeGeometry(0.55, 0.9, 5),                    // funnel
  ];

  const mats = () => PAL[theme].colors.map((c) => new THREE.MeshStandardMaterial({
    color: c, metalness: 0.25, roughness: 0.45, transparent: true, opacity: PAL[theme].op,
    emissive: PAL[theme].emissive, emissiveIntensity: PAL[theme].ei,
  }));
  let materials = mats();

  const group = new THREE.Group();
  scene.add(group);
  const items = [];
  const rnd = (a, b) => a + Math.random() * (b - a); // ok: bg only, not deck logic

  // scattered floating objects, kept mostly toward the edges
  const N = 16;
  for (let i = 0; i < N; i++) {
    const g = geos[i % geos.length];
    const m = materials[i % materials.length];
    const mesh = new THREE.Mesh(g, m);
    const edge = Math.random() < 0.7;
    mesh.position.set(
      edge ? (Math.random() < 0.5 ? rnd(-8.5, -4) : rnd(4, 8.5)) : rnd(-3, 3),
      rnd(-4.5, 4.5),
      rnd(-7, 1.5)
    );
    const s = rnd(0.5, 1.25);
    mesh.scale.setScalar(s);
    mesh.rotation.set(rnd(0, 6.28), rnd(0, 6.28), rnd(0, 6.28));
    mesh.userData = {
      rx: rnd(-0.06, 0.06), ry: rnd(-0.08, 0.08),
      bob: rnd(0.0006, 0.0016), ph: rnd(0, 6.28), baseY: mesh.position.y,
    };
    group.add(mesh);
    items.push(mesh);
  }

  // a small "growth bars" cluster — explicit sales motif, off to one side
  const bars = new THREE.Group();
  const barMat = materials[0];
  [0.6, 1.0, 1.5, 2.0].forEach((h, i) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, h, 0.34), barMat);
    b.position.set(i * 0.5, h / 2 - 1.2, 0);
    bars.add(b);
  });
  bars.position.set(6.2, -2.4, -3.5);
  bars.rotation.y = -0.5;
  group.add(bars);
  items.push(bars);
  bars.userData = { rx: 0, ry: 0.04, bob: 0.0008, ph: 1.0, baseY: bars.position.y };

  function applyTheme() {
    scene.fog.color.setHex(PAL[theme].fog);
    materials = mats();
    let k = 0;
    items.forEach((it) => {
      const target = it.isGroup ? it.children : [it];
      target.forEach((m) => { if (m.material) m.material = materials[k++ % materials.length]; });
    });
    hemi.intensity = PAL[theme].hemi[2];
    dir.intensity = PAL[theme].dir;
  }

  // mouse parallax
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5);
    mouse.ty = (e.clientY / window.innerHeight - 0.5);
  });

  let pulse = 0;
  api.setTheme = (t) => { theme = t; applyTheme(); };
  api.pulse = () => { pulse = 1; };
  window.bg3d = api;

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  let t = 0;
  function loop() {
    requestAnimationFrame(loop);
    t += 1;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    if (pulse > 0.001) pulse *= 0.92; else pulse = 0;

    if (!reduced) {
      items.forEach((it) => {
        const u = it.userData;
        it.rotation.x += u.rx * 0.01;
        it.rotation.y += u.ry * 0.01;
        it.position.y = u.baseY + Math.sin(t * u.bob + u.ph) * 0.4;
      });
    }
    group.rotation.y = mouse.x * 0.5;
    group.rotation.x = mouse.y * 0.32;
    camera.position.z = 9 - pulse * 0.8;
    group.position.z = pulse * 0.6;
    renderer.render(scene, camera);
  }
  applyTheme();
  loop();
} catch (err) {
  // WebGL unavailable: leave the CSS gradient background in place
  if (canvas) canvas.style.display = "none";
  console.warn("bg3d disabled:", err && err.message);
}
