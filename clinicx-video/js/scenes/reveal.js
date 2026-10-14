// Act 2 — the turn and the reveal. A » slices across the frozen red frame and leaves the navy world behind it; the
// question rises word by word; "24H" slams inside a clock ring that closes. Then the signature: the X, three times the
// height of the frame, tears across from the left — the 24H is blown apart by it — and lands, shrinking, as the X of
// the wordmark on the drop; the letters of "clinic" rise behind it on "Clínix"; the tagline arrives on "Gestão".
import { el, set, P, ease, clamp, lerp, svgEl } from '../engine.js';
import { CUE, S, BEAT, b, WORDAT } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, fitFont, slam, shakes, flash, ring, makeSparks, drawSparks, drawSpeedLines } from '../kit.js';
import { ground, chevClip, chevBands, xMark, wordmark } from '../brand.js';
import { dashboard } from '../ui.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '2';
  const bg = ground(root, { seed: 3 });
  const cam = el('div', 'layer', root);
  cam.style.transformOrigin = '50% 50%';
  const bands = chevBands(root);

  // the question
  const q = TX.turn.map((w, i) => {
    const d = el('div', `kin${i === 2 ? ' green' : ''}`, cam, w);
    d.style.fontSize = `${[78, 150, 150][i] * U}px`;
    if (i === 0) d.style.fontWeight = '700';
    return { d, w: fitFont(d, W * 0.88), h: d.offsetHeight };
  });
  const qAt = [CUE.turn, WORDAT('turn', 'trabalhasse'), WORDAT('turn', 'por')];

  // 24H in a clock ring
  const hBox = el('div', 'abs', cam);
  const R = 400 * U;
  const clock = svgEl(`<svg class="abs" width="${2 * R + 60 * U}" height="${2 * R + 60 * U}" viewBox="-430 -430 860 860">
    <circle r="400" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="18"/>
    <circle class="arc" r="400" fill="none" stroke="#60de80" stroke-width="18" stroke-linecap="round" pathLength="1" stroke-dasharray="1" transform="rotate(-90)"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-372" x2="0" y2="-345" stroke="rgba(255,255,255,.35)" stroke-width="8" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}
    <line class="hand" x1="0" y1="0" x2="0" y2="-300" stroke="#fff" stroke-width="12" stroke-linecap="round"/></svg>`, hBox);
  const arc = clock.querySelector('.arc'), hand = clock.querySelector('.hand');
  const h24 = el('div', 'kin', hBox, TX.h24);
  h24.style.fontSize = `${330 * U}px`;
  const h24w = fitFont(h24, W * 0.7);
  const h24h = h24.offsetHeight;
  const sub = el('div', 'kin green', hBox, TX.h24sub);
  sub.style.fontSize = `${76 * U}px`;
  const subW = fitFont(sub, W * 0.6);

  // the wordmark and the flying X
  const wmW = 880 * U;
  const wm = await wordmark(cam, wmW);
  const wmX = (W - wmW) / 2, wmY = H * 0.42 - wm.h / 2;
  set(wm.el, { x: wmX, y: wmY, o: 0 });
  // the icon's content box (40, 77)–(1957, 1583) maps onto the traced X box in the wordmark
  const xb = [1493.97, 101.68, 1995.07, 496.39];
  const k = wmW / wm.vb[0];
  const bigW = ((xb[2] - xb[0]) * k * 2000) / 1917;
  const big = xMark(cam, bigW);
  big.el.style.transformOrigin = '0 0';
  const land = { x: wmX + xb[0] * k - (40 / 2000) * bigW, y: wmY + xb[1] * k - (77 / 1662) * big.h };
  const tag = TX.tag.map((w, i) => {
    const d = el('div', 'abs', cam, w);
    d.style.font = `${i ? 500 : 700} ${(i ? 46 : 64) * U}px/1.1 var(--display)`;
    d.style.color = i ? 'var(--muted)' : '#fff';
    d.style.whiteSpace = 'nowrap';
    return { d, w: fitFont(d, W * 0.88) };
  });
  // the product itself rises under the tagline: the live dashboard (js/ui.js), assembling as it arrives
  const dash = await dashboard(cam, { at: CUE.tag + 0.5 });
  const tabS = (1000 * U) / dash.w, tabW = dash.w * tabS, tabH = dash.h * tabS;
  const shock = ring(cam, 420 * U, 8 * U, 'var(--accent)');
  const sparks = makeSparks({ seed: 41, n: 140, t0: CUE.drop, spread: 0.05, origin: () => [land.x + bigW * 0.55, land.y + big.h * 0.5], dir: 0, cone: Math.PI, v0: 400, v1: 1900, g: 900, life0: 0.4, life1: 1.1, color: [[96, 222, 128], [47, 127, 221], [255, 255, 255]], ember: false });
  const fl = el('div', 'flash', root);

  const enter = [CUE.turn - 0.3, CUE.turn + 0.35];
  return (t, f) => {
    const on = t >= S.reveal[0] && t <= S.reveal[1];
    set(root, { vis: on });
    if (!on) return;
    // the » slice in, over the frozen problem
    const sp = P(t, enter[0], enter[1], ease.inOutSine);
    root.style.clipPath = chevClip(sp);
    bands(sp);
    const beatP = t > CUE.drop ? Math.exp(-(((t - CUE.drop) % BEAT) / BEAT) * 5) : 0;
    bg(t, { pulse: beatP });

    // the question: rises line by line, then lifts away when 24H arrives
    const qOut = P(t, CUE.h24 - 0.4, CUE.h24 - 0.02, ease.inExpo);
    let y = H * 0.4 - q.reduce((a, x, i) => a + x.h * (i ? 0.95 : 1.15), 0) / 2;
    q.forEach((x, i) => {
      const s = i ? slam(t, qAt[i], { from: 1.6, dur: 0.22 }) : { s: 1, o: P(t, qAt[0], qAt[0] + 0.15) };
      const rise = i ? 0 : 80 * U * (1 - P(t, qAt[0], qAt[0] + 0.45, ease.snap));
      set(x.d, { x: W / 2 - x.w / 2, y: y + rise - qOut * 900 * U, s: s.s, o: s.o * (1 - qOut) });
      y += x.h * (i ? 0.95 : 1.15);
    });

    // 24H: slams, the ring closes over a bar and the hand turns; the X blows it apart
    const hIn = slam(t, CUE.h24 + 0.05, { from: 2.2, dur: 0.26 });
    const blow = P(t, CUE.slice, CUE.slice + 0.4, ease.inExpo);
    const cx = W / 2, cy = H * 0.45;
    set(hBox, { x: -blow * 200 * U, y: 0, s: 1 + blow * 1.6, o: (t < CUE.h24 ? 0 : 1) * (1 - blow), origin: `${cx}px ${cy}px` });
    const arcP = P(t, CUE.h24, CUE.h24 + b(4), ease.inOutCubic);
    arc.setAttribute('stroke-dashoffset', (1 - arcP).toFixed(4));
    hand.setAttribute('transform', `rotate(${(arcP * 360).toFixed(2)})`);
    set(clock, { x: cx - R - 30 * U, y: cy - R - 30 * U, s: 0.85 + 0.15 * ease.outExpo(clamp((t - CUE.h24) / 0.5)), o: P(t, CUE.h24, CUE.h24 + 0.2) });
    set(h24, { x: cx - h24w / 2, y: cy - h24h / 2 - 20 * U, s: hIn.s, o: hIn.o });
    set(sub, { x: cx - subW / 2, y: cy + h24h / 2 - 10 * U, o: P(t, CUE.h24 + 0.25, CUE.h24 + 0.45) });

    // the X tears across and lands on the drop
    const fly = P(t, CUE.slice, CUE.drop, ease.outCubic);
    const flyIn = t >= CUE.slice;
    const landed = t >= CUE.drop + 0.12;
    // huge while it crosses the frame (the 24H blown away by it), shrinking hard only in the last third
    const fp = clamp((t - CUE.slice) / (CUE.drop - CUE.slice));
    const sc = lerp(7, 1, ease.inCubic(fp));
    const cxS = lerp(-bigW * 3.5, land.x + bigW / 2, ease.outCubic(fp)); // the X's centre travels left → its landing
    const bx = cxS - (bigW * sc) / 2;
    const by = land.y + big.h / 2 - (big.h * sc) / 2;
    const settle = Math.exp(-Math.max(0, t - CUE.drop) * 9) * Math.sin(Math.max(0, t - CUE.drop) * 38) * 0.04;
    set(big.el, { x: bx, y: by, s: sc * (1 + settle), o: flyIn && !landed ? 1 : 0 });
    // the wordmark: the X part is the traced one from the landing on; the letters rise one by one on "Clínix"
    set(wm.el, { x: wmX, y: wmY, o: t >= CUE.drop ? 1 : 0 });
    wm.x.forEach((p) => set(p, { o: landed ? 1 : 0, s: 1 + settle }));
    wm.letters.forEach((p, i) => {
      const t0 = CUE.drop + 0.06 + i * 0.055;
      const pp = ease.outBack(clamp((t - t0) / 0.32));
      set(p, { y: (1 - pp) * 180 * U, s: 0.6 + 0.4 * pp, o: clamp((t - t0) / 0.1) });
    });
    tag.forEach((x, i) => {
      const t0 = CUE.tag + i * 0.32;
      const pp = ease.snap(clamp((t - t0) / 0.45));
      set(x.d, { x: W / 2 - x.w / 2, y: wmY + wm.h + (90 + i * 84) * U + (1 - pp) * 50 * U, o: pp });
    });
    // the real product rises under the tagline, tilted back, and floats
    const tp = ease.snap(clamp((t - (CUE.tag + 0.5)) / 0.8));
    const ty = H - tabH - 140 * U + (1 - tp) * 700 * U - 30 * U * Math.sin((t - CUE.tag) * 1.2);
    dash.frame(t, f / 60, { x: (W - tabW) / 2, y: ty, s: tabS * (0.9 + 0.1 * tp), rx: lerp(40, 12, tp), o: clamp(tp * 3) });
    dash.floats(t, f / 60, { ox: 0, oy: 0, ax: 0, ay: 0, t1: 1e9, t2: 1e9, s: tabS });
    const shP = P(t, CUE.drop, CUE.drop + 0.6, ease.outCubic);
    set(shock, { x: land.x + bigW * 0.5 - 440 * U, y: land.y + big.h * 0.5 - 440 * U, s: 0.2 + 1.8 * shP, o: t < CUE.drop ? 0 : 0.8 * (1 - shP) });
    if (t >= CUE.drop && t < CUE.drop + 1.3) drawSparks(ctx.fx, sparks, t);
    if (t > CUE.slice - 0.05 && t < CUE.drop + 0.1) drawSpeedLines(ctx.fx, t, { seed: 13, n: 60, dir: 1, alpha: 0.5, speed: 9000, color: '96,222,128' });

    // camera: shakes on every hit, a slow push through the logo hold
    const push = 1 + 0.05 * P(t, CUE.drop, S.reveal[1], ease.inOutSine);
    const sh = shakes(t, [qAt[1], qAt[2], CUE.h24, CUE.drop], 18, 0.4);
    set(cam, { x: sh.x, y: sh.y, r: sh.r, s: push });
    set(fl, { o: Math.max(flash(t, CUE.drop, 0.12, 0.28), flash(t, CUE.h24 + 0.1, 0.1, 0.15)) });
  };
}
