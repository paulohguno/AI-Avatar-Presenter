// Finishing over every scene: the watermark — a large transparent "M" (the person's request) — and a vignette.
// (Film grain is added at encode time by tools/render.mjs.)
import { el, set } from '../engine.js';
import { W, H, U } from '../kit.js';

export async function build(ctx) {
  const wm = el('div', 'abs', ctx.stage, 'M');
  Object.assign(wm.style, { font: `900 ${1100 * U}px/1 var(--display)`, color: '#ffffff', zIndex: '45', pointerEvents: 'none', letterSpacing: '-0.04em' });
  const w = wm.offsetWidth, h = wm.offsetHeight;
  el('div', 'vignette', ctx.stage);
  return (t) => {
    // centred, faint, breathing very slowly so it never reads as a frozen overlay
    set(wm, { x: (W - w) / 2, y: (H - h) / 2, s: 1 + 0.015 * Math.sin(t * 0.35), o: 0.06 });
  };
}
