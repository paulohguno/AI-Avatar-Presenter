// The Clinicx visual language, shared by every scene: the X (a double chevron » with a back stroke) as geometry, the
// » slice that carries every scene change, the living navy ground, and the traced wordmark.
import { el, svgEl, set, clamp, lerp, ease, hash, noise1 } from './engine.js';
import { W, H, U } from './kit.js';

// ---- the X, measured on brand/logo/icon-192x192.png (viewBox 2000 × 1662) ------------------------------------------
export const X_VB = [2000, 1662];
export const X_PATHS = {
  thin: 'M61 77L251 77L960 818L222 1583L40 1583L776 833Z',
  thick: 'M343 77L717 77L1426 818L689 1583L323 1583L1058 833Z',
  up: 'M1237 619L1575 262L1948 262L1426 818Z',
  down: 'M1426 818L1957 1399L1576 1399L1227 1025Z',
};
let gid = 0;
/** The X as an SVG of width w; returns { el, parts: {thin, thick, up, down} } — each part animatable with set(). */
export function xMark(parent, w, { color = 'var(--accent)' } = {}) {
  const id = `xg${gid++}`;
  const h = (w * X_VB[1]) / X_VB[0];
  const svg = svgEl(`<svg class="abs" width="${w}" height="${h}" viewBox="0 0 ${X_VB[0]} ${X_VB[1]}">
    <defs><linearGradient id="${id}" x1="1227" x2="1957" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#14361f"/><stop offset=".45" stop-color="#4fb468"/><stop offset=".75" stop-color="${color}"/></linearGradient></defs>
    <g class="up"><path d="${X_PATHS.up}" fill="url(#${id})"/></g>
    <g class="down"><path d="${X_PATHS.down}" fill="url(#${id})"/></g>
    <g class="thin"><path d="${X_PATHS.thin}" fill="${color}"/></g>
    <g class="thick"><path d="${X_PATHS.thick}" fill="${color}"/></g>
  </svg>`, parent);
  const parts = {};
  for (const k of ['thin', 'thick', 'up', 'down']) { parts[k] = svg.querySelector(`.${k}`); parts[k].style.transformBox = 'fill-box'; parts[k].style.transformOrigin = '50% 50%'; }
  return { el: svg, parts, w, h };
}

// ---- the » slice: a chevron-shaped reveal sweeping left → right ----------------------------------------------------
/** Depth of the chevron (how far the arms trail the tip), in px. */
export const CHEV = H * 0.32;
/** Tip position for progress p: the frame is fully covered when the arms have left the right edge. */
const tipX = (p) => lerp(-40 * U, W + CHEV + 40 * U, p);
/** clip-path for the incoming scene at progress p (0 hidden → 1 full); dir -1 sweeps right → left. */
export function chevClip(p, dir = 1) {
  if (p >= 1) return 'none';
  const x = tipX(clamp(p));
  if (dir > 0) return `polygon(-10px -10px, ${x - CHEV}px -10px, ${x}px ${H / 2}px, ${x - CHEV}px ${H + 10}px, -10px ${H + 10}px)`;
  const xr = W - x;
  return `polygon(${W + 10}px -10px, ${xr + CHEV}px -10px, ${xr}px ${H / 2}px, ${xr + CHEV}px ${H + 10}px, ${W + 10}px ${H + 10}px)`;
}
/**
 * The bands that ride the edge of a slice: a thick green chevron at the edge and a thin one behind it — the logo's
 * » at the size of the frame. Returns draw(p) to call every frame (p as for chevClip; hidden outside 0 < p < 1).
 */
export function chevBands(parent, { dir = 1, colors = ['var(--accent)', 'var(--accent)'], z = 30 } = {}) {
  const svg = svgEl(`<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="z-index:${z};pointer-events:none">
    <path fill="${colors[0]}"/><path fill="${colors[1]}"/></svg>`, parent);
  const [thick, thin] = svg.querySelectorAll('path');
  const T1 = 150 * U, G = 46 * U, T2 = 62 * U;
  const band = (x, a, b) => `M${x - a - CHEV} -20L${x - a} ${H / 2}L${x - a - CHEV} ${H + 20}L${x - b - CHEV} ${H + 20}L${x - b} ${H / 2}L${x - b - CHEV} -20Z`;
  return (p) => {
    const on = p > 0 && p < 1;
    set(svg, { o: on ? 1 : 0, sx: dir, origin: '50% 50%' });
    if (!on) return;
    const x = tipX(p);
    thick.setAttribute('d', band(x, 0, T1));
    thin.setAttribute('d', band(x, T1 + G, T1 + G + T2));
  };
}

// ---- the ground --------------------------------------------------------------------------------------------------
/**
 * Navy ground that lives: a vertical gradient, two blurred brand-blue light fields drifting, a faint field of »
 * chevrons sliding right (the brand's forward motion), grain. Returns draw(t, { tint, pulse }).
 */
export function ground(parent, { seed = 1, chevrons = true } = {}) {
  const g = el('div', 'layer', parent);
  g.style.background = 'linear-gradient(180deg, #0b1d52 0%, var(--bg) 55%, #050f2a 100%)';
  const blobs = [0, 1, 2].map((i) => {
    const d = el('div', 'abs', g);
    const R = (900 + 300 * i) * U;
    Object.assign(d.style, { width: `${R}px`, height: `${R}px`, borderRadius: '50%',
      background: `radial-gradient(circle, ${i === 2 ? 'rgba(96,222,128,.16)' : 'rgba(47,127,221,.42)'} 0%, transparent 65%)` });
    return { d, R, i };
  });
  let pat = null;
  if (chevrons) {
    pat = el('div', 'layer', g);
    const s = 180 * U;
    pat.style.inset = `-${s}px`;
    pat.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}' viewBox='0 0 180 180'><path d='M60 50l30 40-30 40M86 50l30 40-30 40' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/></svg>`)}")`;
    pat.style.backgroundSize = `${s}px ${s}px`;
    pat.dataset.s = s;
  }
  return (t, { pulse = 0, o = 1 } = {}) => {
    blobs.forEach(({ d, R, i }) => {
      const x = W * (0.2 + 0.6 * hash(i, seed)) + 220 * U * noise1(t * 0.18 + i * 3, seed + i) - R / 2;
      const y = H * (0.15 + 0.7 * hash(i + 5, seed)) + 260 * U * noise1(t * 0.15 + i * 7, seed + 9) - R / 2;
      set(d, { x, y, s: 1 + 0.08 * pulse, o: 1 });
    });
    if (pat) { const s = Number(pat.dataset.s); set(pat, { x: (t * 60 * U) % s, y: 0, o: 0.035 + 0.03 * pulse }); }
    set(g, { o });
  };
}

// ---- the wordmark (traced from brand/logo/logo-1.png: shapes 0–7 'clinic', 8–9 the X) -------------------------------
/** Loads assets/logo.json and builds the wordmark at width w: { el, letters: [svg <path>…], x: [<path>, <path>], w, h }. */
export async function wordmark(parent, w, { ink = '#ffffff', xColor = 'var(--accent)' } = {}) {
  const j = await (await fetch('assets/logo.json')).json();
  const h = (w * j.h) / j.w;
  const svg = svgEl(`<svg class="abs" width="${w}" height="${h}" viewBox="0 0 ${j.w} ${j.h}">${j.shapes
    .map((s, i) => `<path d="${s.d}" fill="${i >= 8 ? xColor : ink}"/>`).join('')}</svg>`, parent);
  const paths = [...svg.querySelectorAll('path')];
  paths.forEach((p) => { p.style.transformBox = 'fill-box'; p.style.transformOrigin = '50% 100%'; });
  return { el: svg, letters: paths.slice(0, 8), x: paths.slice(8), w, h, boxes: j.shapes.map((s) => s.box), vb: [j.w, j.h] };
}

// ---- small UI helpers ----------------------------------------------------------------------------------------------
/** A preloaded <img> from assets/img, sized to width w (height follows). */
export function uiImg(parent, src, w, cls = 'ui') {
  const i = el('img', cls, parent);
  i.src = src;
  i.style.width = `${w}px`;
  return i;
}
export const imgReady = (imgs) => Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? null : new Promise((r) => { i.onload = r; i.onerror = r; }))));

/** A green check in a circle (the site's list bullet), as an SVG string at size s. */
export const checkSvg = (s, fill = '#60de80') => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${fill}"/><path class="tick" d="M14 25l7 7 13-15" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg>`;

/** Line-icon glyphs in the site's style (phone, pin, calendar, user+, bell, doc, receipt, card, link, ig). */
export const ICONS = {
  phone: '<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M21 38h6"/><circle cx="24" cy="22" r="5"/><path d="M21.8 22l1.6 1.6 3-3.2"/>',
  pin: '<path d="M24 44s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z"/><path d="M24 14v12M18 20h12"/>',
  cal: '<rect x="6" y="9" width="36" height="33" rx="5"/><path d="M6 18h36M15 5v8M33 5v8M24 24v12M18 30h12"/>',
  user: '<circle cx="21" cy="16" r="7"/><path d="M8 40c0-8 6-13 13-13 3 0 5 .6 7 1.8"/><path d="M36 28v14M29 35h14"/>',
  bell: '<path d="M12 34V22a12 12 0 0 1 24 0v12l4 4H8z"/><path d="M20 42a4 4 0 0 0 8 0"/>',
  doc: '<path d="M12 4h17l9 9v31H12z"/><path d="M29 4v9h9M18 24h14M18 31h14M18 38h8"/>',
  rx: '<path d="M10 6h28v36H10z"/><path d="M17 15h6a4 4 0 0 1 0 8h-6v-8zm0 8v9M23 23l8 9M31 23l-8 9"/>',
  card: '<rect x="4" y="11" width="40" height="27" rx="5"/><path d="M4 19h40M11 30h10"/>',
  link: '<path d="M20 28l8-8"/><path d="M22 14l4-4a8 8 0 0 1 12 12l-4 4M26 34l-4 4a8 8 0 0 1-12-12l4-4"/>',
  ig: '<rect x="6" y="6" width="36" height="36" rx="10"/><circle cx="24" cy="24" r="8"/><circle cx="34.5" cy="13.5" r="1.5" fill="currentColor"/>',
  chat: '<path d="M8 10h32v22H20l-9 8v-8H8z"/>',
};
export const icon = (name, s, stroke = 'currentColor', sw = 3) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
