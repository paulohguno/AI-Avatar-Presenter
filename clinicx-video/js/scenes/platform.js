// The platform: "E pra você: agenda, prontuário digital, financeiro e CRM. Tudo em um só lugar." The product's
// dashboard rebuilt live (js/ui.js): it assembles itself — the menu slides in, the greeting types, the module cards
// pop, the totals count, the chart's bars grow — while a smart camera pushes into the module the narration names:
// Agenda, Pacientes (the patient record), Financeiro; on "CRM" the CRC item lights and the Orçamentos card flies in
// with its pie drawing; on "Tudo" the camera pulls back to the whole screen and TUDO EM UM SÓ LUGAR lands.
// Then the CRC: "Chega de orçamentos esquecidos" — the red words of act 1 come back and a green » wipes them to
// RECUPERADOS over the live CRC Vendas board (columns drop in, cards cascade, totals count); the quote slams.
import { el, set, P, ease, clamp, lerp, zoomLog } from '../engine.js';
import { CUE, S, BEAT, b, WORDAT } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, fitFont, slam, shakes, whip, drawSpeedLines, flash } from '../kit.js';
import { ground, chevClip, chevBands } from '../brand.js';
import { dashboard, crcBoard } from '../ui.js';

/** Camera keys [[t, [px, py, z]], …] over a design: each move ARRIVES at its key's time (it starts up to 0.55 s
 *  before), so the push lands on the word; zoom in log space. */
function cam(t, ks) {
  let i = ks.findIndex((k) => t < k[0]);
  if (i < 0) return ks[ks.length - 1][1];
  if (i === 0) return ks[0][1];
  const a = ks[i - 1][1], z = ks[i][1];
  const dur = Math.min(0.55, ks[i][0] - ks[i - 1][0]);
  const p = ease.inOutCubic(clamp((t - (ks[i][0] - dur)) / dur));
  return [lerp(a[0], z[0], p), lerp(a[1], z[1], p), zoomLog(p, a[2], z[2])];
}

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '5';
  const bg = ground(root, { seed: 11 });
  const camL = el('div', 'layer', root);
  const bands = chevBands(root);

  // ---- A: the live dashboard
  const A = el('div', 'layer', camL);
  const t0 = S.platform[0] + 0.1;
  const dash = await dashboard(A, { at: t0 });
  const fAt = [CUE.f1, CUE.f2, CUE.f3, CUE.f4];
  dash.hiAt.push([CUE.f1, 0], [CUE.f2, 1], [CUE.f3, 2], [CUE.f4, 9]);
  const words = TX.platform.modules.map((m, i) => {
    const d = el('div', `kin${i % 2 ? ' green' : ''}`, A, m.toUpperCase());
    d.style.fontSize = `${130 * U}px`;
    return { d, w: fitFont(d, W * 0.9) };
  });
  const all = TX.platform.all.map((w, i) => {
    const d = el('div', `kin${i ? ' green' : ''}`, A, w);
    d.style.fontSize = `${(i ? 140 : 110) * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });
  // the camera: the whole screen, then each module the narration names (design coordinates of the dashboard)
  const Z0 = (W * 0.93) / dash.w, CY = 760 * U, ZM = 1.45 * U;
  const card = (i) => [240 + i * (291.5 + 14) + 145, 290];
  const camKeys = [[t0, [dash.w / 2, dash.h / 2, Z0]], [CUE.f1, [...card(0), ZM]], [CUE.f2, [...card(1), ZM]],
    [CUE.f3, [...card(2), ZM]], [CUE.f4, [1300, 360, ZM * 0.95]], [CUE.allIn - 0.2, [1300, 360, ZM * 0.95]], [CUE.allIn + 0.2, [dash.w / 2, dash.h / 2, Z0]]];

  // ---- B: the live CRC board
  const B = el('div', 'layer', camL);
  const swap = CUE.crc - b(0.75);
  const crc = crcBoard(B, { at: swap + 0.15 });
  const old = el('div', 'abs', B);
  const oldA = el('div', 'kin', old, TX.budget.title);
  const oldB = el('div', 'kin prob', old, TX.budget.title2);
  const newB = el('div', 'kin green', old, 'RECUPERADOS');
  for (const d of [oldA, oldB, newB]) d.style.fontSize = `${110 * U}px`;
  const oaW = fitFont(oldA, W * 0.88), obW = fitFont(oldB, W * 0.88), nbW = fitFont(newB, W * 0.88);
  const strike = el('div', 'abs', old);
  Object.assign(strike.style, { height: `${16 * U}px`, borderRadius: `${8 * U}px`, background: 'var(--accent)', transformOrigin: '0 50%' });
  const quote = TX.crc.title.map((w, i) => {
    const d = el('div', `kin${i ? ' green' : ''}`, B, w);
    d.style.fontSize = `${(i ? 130 : 100) * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });
  const fl = el('div', 'flash', root);

  const enter = [S.platform[0], S.platform[0] + b(1.1)];
  const fixed = WORDAT('crc', 'esquecidos') + 0.35;
  return (t, f) => {
    const on = t >= S.platform[0] && t <= S.platform[1];
    set(root, { vis: on });
    if (!on) return;
    const ft = f / 60;
    const sp = P(t, enter[0], enter[1], ease.inOutSine);
    root.style.clipPath = chevClip(sp);
    bands(sp);
    bg(t, { pulse: Math.exp(-((t % BEAT) / BEAT) * 5) });

    // ---- A
    const outA = whip(t, swap, b(0.9), W * 1.3, 'out');
    if (t >= swap + b(0.9)) set(A, { vis: false });
    else {
      set(A, { vis: true, x: outA, y: 0, o: 1 });
      const [px, py, z] = cam(t, camKeys);
      const ent = ease.snap(clamp((t - t0) / 0.8));
      const x = W / 2 - px * z, y = CY - py * z + (1 - ent) * 500 * U;
      dash.frame(t, ft, { x, y, s: z, rx: (1 - ent) * 30, o: clamp(ent * 3) });
      dash.floats(t, ft, { ox: x + 1060 * z, oy: y + 300 * z, ax: x + 1060 * z, ay: y + 480 * z, t1: CUE.f4 - 0.1, t2: CUE.allIn + 0.1, s: z });
      // the module's name under the screen, one at a time
      words.forEach((wd, i) => {
        const a = fAt[i], z2 = i < 3 ? fAt[i + 1] : CUE.allIn - 0.1;
        const s = slam(t, a, { from: 1.5, dur: 0.2 });
        const out = P(t, z2 - 0.12, z2, ease.inCubic);
        set(wd.d, { x: W / 2 - wd.w / 2, y: 1630 * U - out * 60 * U, s: s.s, o: s.o * (1 - out) });
      });
      let ay = 1330 * U;
      all.forEach((x2, i) => {
        const s = slam(t, CUE.allIn + 0.2 + i * 0.28, { from: 1.7, dur: 0.22 });
        set(x2.d, { x: W / 2 - x2.w / 2, y: ay, s: s.s, o: s.o });
        ay += x2.h * 0.95;
      });
    }

    // ---- B: the CRC
    if (t < swap) set(B, { vis: false });
    else {
      const inB = whip(t, swap, b(1), -W * 1.2, 'in');
      set(B, { vis: true, x: inB, y: 0, o: 1 });
      // two columns at a time: the "não optado" ones while the red words are wiped, the other two for the quote
      const zc = 1.22 * U;
      const colX = (i) => 6 + i * ((crc.w - 12 - 36) / 4 + 12);
      const pan = P(t, CUE.chosen - 0.45, CUE.chosen + 0.15, ease.inOutCubic);
      const px = lerp(colX(0) - 14, colX(2) - 14, pan);
      crc.frame(t, ft, { x: (W - 2 * ((crc.w - 48) / 4 + 12) * zc) / 2 + 6 * U - px * zc + 22 * Math.sin((t - swap) * 0.8) * U, y: 640 * U, s: zc, rx: 3 });
      const wp = P(t, fixed, fixed + 0.35, ease.inOutSine);
      set(old, { x: 0, y: 0, o: 1 - P(t, CUE.chosen - 0.3, CUE.chosen, ease.inCubic) });
      const oy = 230 * U;
      set(oldA, { x: W / 2 - oaW / 2, y: oy, o: 1 });
      set(oldB, { x: W / 2 - obW / 2, y: oy + 125 * U, o: 1 - wp });
      newB.style.clipPath = `inset(0 ${(100 - wp * 100).toFixed(1)}% 0 0)`;
      set(newB, { x: W / 2 - nbW / 2, y: oy + 125 * U, o: wp > 0 ? 1 : 0 });
      set(strike, { x: W / 2 - obW / 2, y: oy + 125 * U + 70 * U, sx: (obW / (16 * U)) * P(t, fixed - 0.3, fixed, ease.outCubic), o: 1 - wp });
      let qy = 230 * U;
      quote.forEach((x2, i) => {
        const at = i ? WORDAT('crc', 'escolhido') : CUE.chosen;
        const s = slam(t, at, { from: 1.6, dur: 0.22 });
        set(x2.d, { x: W / 2 - x2.w / 2, y: qy, s: s.s, o: s.o });
        qy += x2.h;
      });
    }

    const sh = shakes(t, [...fAt, CUE.allIn + 0.2, fixed, CUE.chosen, WORDAT('crc', 'escolhido')], 8, 0.3);
    set(camL, { x: sh.x, y: sh.y, r: sh.r, s: 1 });
    set(fl, { o: flash(t, CUE.allIn + 0.2, 0.12, 0.15) });
    if ((t > swap - 0.05 && t < swap + b(1)) || (sp > 0 && sp < 1)) drawSpeedLines(ctx.fx, t, { seed: 29, n: 50, dir: -1, alpha: 0.35, speed: 8500 });
  };
}
