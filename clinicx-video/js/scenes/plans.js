// Plans: "Planos a partir de setenta e nove e noventa por mês. Com sete dias grátis pra testar." The price rolls up
// to R$ 79,90 on "setenta" and lands; the site's four plan cards deal in below (prices exactly as published, the
// Infinity marked MAIS VENDIDO as on the site); on "Com sete dias grátis" every card's green 7 DIAS GRÁTIS badge pops
// with green confetti.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, BEAT, b, FPS } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, fitFont, slam, shakes, roll, makeSparks, drawSparks, flash } from '../kit.js';
import { ground, chevClip, chevBands } from '../brand.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '6';
  const bg = ground(root, { seed: 13 });
  const cam = el('div', 'layer', root);
  const bands = chevBands(root);
  const T = TX.plans;

  const from = el('div', 'abs', cam, T.from);
  Object.assign(from.style, { font: `600 ${60 * U}px/1 var(--display)`, color: 'var(--muted)', whiteSpace: 'nowrap' });
  const fromW = from.offsetWidth;
  const price = el('div', 'abs', cam);
  Object.assign(price.style, { display: 'flex', alignItems: 'flex-start', gap: `${14 * U}px`, color: '#fff', whiteSpace: 'nowrap' });
  price.innerHTML = `<span style="font:700 ${80 * U}px/1 var(--display);margin-top:${70 * U}px">R$</span><span class="big" style="font:800 ${300 * U}px/1 var(--display);letter-spacing:-0.04em">79</span><span style="display:flex;flex-direction:column;margin-top:${50 * U}px"><span class="cents" style="font:800 ${110 * U}px/1 var(--display);color:var(--accent)">,90</span><span style="font:600 ${52 * U}px/1.3 var(--display);color:var(--muted)">${T.per}</span></span>`;
  const big = price.querySelector('.big');
  big.style.minWidth = `${big.offsetWidth}px`;
  big.style.textAlign = 'right';
  const priceW = price.offsetWidth;

  const cw = 470 * U, ch = 330 * U;
  const cards = [...T.cards, [T.multi, null]].map(([name, p], i) => {
    const c = el('div', 'card', cam);
    const best = i === 2;
    Object.assign(c.style, { width: `${cw}px`, height: `${ch}px`, padding: `${70 * U}px ${34 * U}px ${30 * U}px`, boxSizing: 'border-box', background: best ? '#eef6ff' : '#fff' });
    c.innerHTML = `<div style="font:700 ${36 * U}px/1.15 var(--display);color:#333">${name}</div>
      <div style="margin-top:${18 * U}px;color:#2a6df6;white-space:nowrap">${p === null
        ? `<span style="font:800 ${46 * U}px/1.1 var(--display)">${T.multiPrice}</span>`
        : `<span style="font:600 ${30 * U}px/1 var(--display);color:#333">R$ </span><span style="font:800 ${92 * U}px/1 var(--display)">${p}</span><span style="font:700 ${36 * U}px/1 var(--display);vertical-align:top">90</span>`}</div>`;
    const badges = el('div', 'abs', cam);
    Object.assign(badges.style, { display: 'flex', gap: `${10 * U}px` });
    const mk = (txt, bgc) => { const d = el('div', '', badges, txt); Object.assign(d.style, { padding: `${12 * U}px ${18 * U}px`, borderRadius: `${14 * U}px`, background: bgc, color: '#fff', font: `700 ${26 * U}px/1 var(--display)`, whiteSpace: 'nowrap', boxShadow: '0 6px 18px rgba(0,0,0,.18)' }); return d; };
    if (best) mk(T.best, '#2a6df6');
    mk(T.badge, '#3ccf6a');
    return { c, badges, i };
  });
  const gx = (W - 2 * cw - 40 * U) / 2, gy = 1010 * U;
  const conf = makeSparks({ seed: 53, n: 160, t0: CUE.free, spread: 0.12, origin: (u) => [W * (0.1 + 0.8 * u), gy - 40 * U], dir: -Math.PI / 2, cone: 0.9, v0: 500, v1: 1500, g: 1500, life0: 0.8, life1: 1.6, color: [[96, 222, 128], [47, 127, 221], [255, 255, 255]], ember: false });
  const fl = el('div', 'flash', root);

  const enter = [S.plans[0], S.plans[0] + b(1.1)];
  return (t, f) => {
    const on = t >= S.plans[0] && t <= S.plans[1];
    set(root, { vis: on });
    if (!on) return;
    const sp = P(t, enter[0], enter[1], ease.inOutSine);
    root.style.clipPath = chevClip(sp);
    bands(sp);
    bg(t, { pulse: Math.exp(-((t % BEAT) / BEAT) * 5) });

    const fp = ease.snap(clamp((t - S.plans[0] - 0.25) / 0.5));
    set(from, { x: W / 2 - fromW / 2, y: 330 * U + (1 - fp) * 60 * U, o: fp });
    big.textContent = roll(f / FPS, CUE.price - 0.35, 0.6, 0, 79);
    const ps = slam(t, CUE.price + 0.25, { from: 1.25, dur: 0.22, overshoot: 0.05 });
    const pin = ease.snap(clamp((t - CUE.price + 0.4) / 0.4));
    set(price, { x: W / 2 - priceW / 2, y: 430 * U, s: t < CUE.price + 0.25 ? 0.92 + 0.08 * pin : ps.s, o: pin });

    cards.forEach(({ c, badges, i }) => {
      const t0 = CUE.price + 0.7 + i * 0.16;
      const p = ease.outBack(clamp((t - t0) / 0.45));
      const x = gx + (i % 2) * (cw + 40 * U), y = gy + Math.floor(i / 2) * (ch + 70 * U);
      set(c, { x, y: y + (1 - p) * 500 * U, r: (1 - p) * (i % 2 ? 12 : -12), o: clamp((t - t0) / 0.1) });
      const bs = slam(t, CUE.free + i * 0.08, { from: 0.1, dur: 0.25, overshoot: 0.12 });
      set(badges, { x: x + 20 * U, y: y - 22 * U + (1 - p) * 500 * U, s: bs.s, o: bs.o, origin: '0% 50%' });
    });
    if (t >= CUE.free && t < CUE.free + 2) drawSparks(ctx.fx, conf, t);
    const sh = shakes(t, [CUE.price + 0.25, CUE.free], 14, 0.35);
    set(cam, { x: sh.x, y: sh.y, r: sh.r, s: 1 + 0.03 * P(t, S.plans[0], S.plans[1], ease.inOutSine) });
    set(fl, { o: flash(t, CUE.price + 0.25, 0.12, 0.2) });
  };
}
