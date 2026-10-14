// Act 1 — the problem (0 → the question). A near-black, cold frame where the only colour is the site's #CC3366.
// The hook: "SUA CLÍNICA ESTÁ / PERDENDO / DINHEIRO" over a giant R$ that drains like a leaking tank; "TODOS OS DIAS"
// as a strip of weekdays that turn red. Then one pain per phrase of the narration, each cut in with a glitch: the
// agenda whose slots flip to FALTOU, the budget card sliding into a drawer, a phone flooding with unanswered messages.
// They collapse into a cash line that falls off the frame — "A CONTA NÃO FECHA" — and the hole: the frame freezes.
import { el, set, P, ease, clamp, lerp, hash, svgEl } from '../engine.js';
import { CUE, S, FPS, BEAT, b, WORDAT } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, fitFont, slam, shakes, flash, drawSpeedLines } from '../kit.js';
import { icon } from '../brand.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '1';
  root.style.background = 'var(--dark)';
  const red = el('div', 'layer', root);
  red.style.background = 'radial-gradient(ellipse 80% 55% at 50% 62%, rgba(204,51,102,.28), transparent 70%)';
  const grid = el('div', 'layer', root);
  grid.style.backgroundImage = 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)';
  grid.style.backgroundSize = `${90 * U}px ${90 * U}px`;
  const cam = el('div', 'layer', root);
  cam.style.transformOrigin = '50% 50%';

  // ---- hook: the draining R$ ---------------------------------------------------------------------------------------
  const tank = svgEl(`<svg class="abs" width="${W}" height="${900 * U}" viewBox="0 0 1080 900">
    <defs><clipPath id="rsclip"><text x="540" y="760" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="760" letter-spacing="-40">R$</text></clipPath>
    <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff4d85"/><stop offset="1" stop-color="#8a1d42"/></linearGradient></defs>
    <text x="540" y="760" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="760" letter-spacing="-40" fill="none" stroke="rgba(204,51,102,.55)" stroke-width="5">R$</text>
    <g clip-path="url(#rsclip)"><path class="liquid" fill="url(#liq)"/></g></svg>`, cam);
  const liquid = tank.querySelector('.liquid');
  const drips = [0, 1, 2, 3, 4].map((i) => {
    const d = el('div', 'abs', cam);
    Object.assign(d.style, { width: `${16 * U}px`, height: `${46 * U}px`, borderRadius: `${10 * U}px`, background: 'var(--problem)' });
    return d;
  });
  const lead = el('div', 'kin', cam, TX.hook[0]);
  lead.style.font = `700 ${70 * U}px/1 var(--display)`;
  lead.style.color = 'rgba(255,255,255,.85)';
  const leadW = fitFont(lead, W * 0.86);
  const big = TX.hook.slice(1).map((w, i) => {
    const d = el('div', `kin${i ? ' prob' : ''}`, cam, w);
    d.style.fontSize = `${170 * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });
  const days = el('div', 'abs', cam);
  const dayNames = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const chips = dayNames.map((n) => {
    const c = el('div', 'abs', days, n);
    Object.assign(c.style, { width: `${150 * U}px`, height: `${150 * U}px`, borderRadius: `${26 * U}px`, display: 'grid', placeItems: 'center',
      font: `700 ${38 * U}px/1 var(--display)`, border: `${3 * U}px solid rgba(255,255,255,.18)`, color: 'rgba(255,255,255,.75)' });
    return c;
  });
  const daily = el('div', 'kin', cam, TX.daily);
  daily.style.fontSize = `${96 * U}px`;
  const dailyW = fitFont(daily, W * 0.86);

  // ---- pain 1: the agenda --------------------------------------------------------------------------------------------
  const p1 = el('div', 'abs', cam);
  const t1 = el('div', 'kin prob', p1, TX.noshow.title);
  t1.style.fontSize = `${180 * U}px`;
  const t1w = fitFont(t1, W * 0.86);
  const agW = 800 * U, rowH = 128 * U;
  const ag = el('div', 'abs', p1);
  Object.assign(ag.style, { width: `${agW}px`, height: `${rowH * 6 + 130 * U}px`, borderRadius: `${32 * U}px`, background: '#151a28',
    border: `${2 * U}px solid rgba(255,255,255,.08)`, boxShadow: '0 40px 100px rgba(0,0,0,.6)' });
  const agHead = el('div', 'abs', ag, `${icon('cal', 44 * U, '#9fb1d6', 3)}<span>${TX.noshow.label}</span>`);
  Object.assign(agHead.style, { display: 'flex', gap: `${18 * U}px`, alignItems: 'center', font: `600 ${36 * U}px/1 var(--display)`, color: '#9fb1d6', left: `${44 * U}px`, top: `${42 * U}px` });
  const rows = TX.noshow.hours.map((hr, i) => {
    const r = el('div', 'abs', ag);
    Object.assign(r.style, { left: `${30 * U}px`, top: `${110 * U + i * rowH}px`, width: `${agW - 60 * U}px`, height: `${rowH - 18 * U}px`, borderRadius: `${20 * U}px`, background: 'rgba(255,255,255,.05)' });
    const time = el('div', 'abs', r, hr);
    Object.assign(time.style, { left: `${30 * U}px`, top: `${36 * U}px`, font: `600 ${38 * U}px/1 var(--display)`, color: 'rgba(255,255,255,.8)' });
    const bar = el('div', 'abs', r);
    Object.assign(bar.style, { left: `${200 * U}px`, top: `${40 * U}px`, width: `${(260 + 140 * hash(i, 3)) * U}px`, height: `${30 * U}px`, borderRadius: `${15 * U}px`, background: 'rgba(255,255,255,.14)' });
    const stamp = el('div', 'abs', r, TX.noshow.slot);
    Object.assign(stamp.style, { right: `${26 * U}px`, left: 'auto', top: `${24 * U}px`, padding: `${12 * U}px ${22 * U}px`, borderRadius: `${14 * U}px`,
      font: `800 ${34 * U}px/1 var(--display)`, color: '#fff', background: 'var(--problem)', letterSpacing: '0.04em' });
    return { r, bar, stamp };
  });
  // which slots fail, and when: over the words "Paciente que falta e não avisa"
  const failing = [1, 3, 4, 0];
  const failAt = failing.map((_, k) => lerp(WORDAT('chaos', 'falta'), WORDAT('chaos', 'avisa') + 0.3, k / (failing.length - 1)));

  // ---- pain 2: the forgotten budget ----------------------------------------------------------------------------------
  const p2 = el('div', 'abs', cam);
  const t2 = [TX.budget.title, TX.budget.title2].map((w, i) => {
    const d = el('div', `kin${i ? ' prob' : ''}`, p2, w);
    d.style.fontSize = `${120 * U}px`;
    return { d, w: fitFont(d, W * 0.88) };
  });
  const drawer = el('div', 'abs', p2);
  Object.assign(drawer.style, { width: `${880 * U}px`, height: `${300 * U}px`, borderRadius: `${24 * U}px`,
    background: 'linear-gradient(180deg,#1b2131,#10141f)', border: `${2 * U}px solid rgba(255,255,255,.08)`, boxShadow: 'inset 0 30px 60px rgba(0,0,0,.6)' });
  const handle = el('div', 'abs', drawer);
  Object.assign(handle.style, { left: `${340 * U}px`, top: `${210 * U}px`, width: `${200 * U}px`, height: `${26 * U}px`, borderRadius: `${13 * U}px`, background: 'rgba(255,255,255,.18)' });
  const bud = el('div', 'card', p2);
  const budW = 720 * U, budH = 520 * U;
  Object.assign(bud.style, { width: `${budW}px`, height: `${budH}px`, padding: `${46 * U}px`, boxSizing: 'border-box' });
  bud.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;font:700 ${44 * U}px/1 var(--display)">${TX.budget.card}
    <span style="font:700 ${28 * U}px/1 var(--display);color:#fff;background:#e2687f;padding:${10 * U}px ${18 * U}px;border-radius:${12 * U}px">${TX.budget.days}</span></div>
    <div style="margin-top:${22 * U}px;font:600 ${32 * U}px/1 var(--display);color:#cc3366">${TX.budget.status}</div>
    ${[0.9, 0.7, 0.8, 0.55].map((w) => `<div style="margin-top:${34 * U}px;height:${26 * U}px;width:${w * 100}%;border-radius:${13 * U}px;background:#e6e9f0"></div>`).join('')}`;

  // ---- pain 3: the flooding WhatsApp ---------------------------------------------------------------------------------
  const p3 = el('div', 'abs', cam);
  const t3 = [TX.whats.title, TX.whats.title2].map((w, i) => {
    const d = el('div', `kin${i ? ' prob' : ''}`, p3, w);
    d.style.fontSize = `${120 * U}px`;
    return { d, w: fitFont(d, W * 0.88) };
  });
  const phW = 560 * U, phH = 1000 * U;
  const phone = el('div', 'abs', p3);
  Object.assign(phone.style, { width: `${phW}px`, height: `${phH}px`, borderRadius: `${70 * U}px`, background: '#0f1420',
    border: `${12 * U}px solid #262c3b`, boxShadow: '0 50px 120px rgba(0,0,0,.7)', overflow: 'hidden' });
  const feed = el('div', 'abs', phone);
  const bubbles = Array.from({ length: 14 }, (_, i) => {
    const txt = TX.whats.bubbles[i % TX.whats.bubbles.length];
    const d = el('div', 'abs', feed, txt);
    Object.assign(d.style, { maxWidth: `${phW - 110 * U}px`, padding: `${20 * U}px ${26 * U}px`, borderRadius: `${26 * U}px ${26 * U}px ${26 * U}px ${6 * U}px`,
      background: '#1f2636', color: '#e8ecf5', font: `500 ${30 * U}px/1.25 var(--display)`, whiteSpace: 'nowrap' });
    return { d, h: 0 };
  });
  bubbles.forEach((bb) => { bb.h = bb.d.offsetHeight; });
  const badge = el('div', 'abs', p3);
  Object.assign(badge.style, { height: `${96 * U}px`, minWidth: `${96 * U}px`, padding: `0 ${22 * U}px`, boxSizing: 'border-box', borderRadius: `${48 * U}px`,
    background: 'var(--problem)', color: '#fff', font: `800 ${48 * U}px/${96 * U}px var(--display)`, textAlign: 'center', boxShadow: '0 0 40px rgba(204,51,102,.6)' });
  const bubbleAt = (i) => CUE.whats + 0.1 + i * 0.16;

  // ---- the fall: the cash line ---------------------------------------------------------------------------------------
  const p4 = el('div', 'abs', cam);
  const chart = svgEl(`<svg class="abs" width="${W}" height="${900 * U}" viewBox="0 0 1080 900">
    <path class="area" fill="rgba(204,51,102,.18)"/><path class="ln" fill="none" stroke="#cc3366" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="dot" r="20" fill="#ff4d85"/></svg>`, p4);
  const ln = chart.querySelector('.ln'), area = chart.querySelector('.area'), dot = chart.querySelector('.dot');
  const pts = [[60, 300], [190, 260], [300, 330], [420, 280], [540, 360], [640, 330], [740, 470], [830, 560], [920, 760], [1000, 1000], [1060, 1400]];
  const broke = TX.broke.map((w, i) => {
    const d = el('div', `kin${i ? ' prob' : ''}`, p4, w);
    d.style.fontSize = `${(i ? 170 : 120) * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });

  const fl = el('div', 'flash', root);
  fl.style.background = 'var(--problem)';

  // the windows of the parts
  const A = [0, CUE.noshow - 0.05];
  const B1 = [CUE.noshow - 0.05, CUE.budget - 0.05];
  const B2 = [CUE.budget - 0.05, CUE.whats - 0.05];
  const B3 = [CUE.whats - 0.05, CUE.broke - 0.05];
  const C = [CUE.broke - 0.05, S.problem[1]];
  const cuts = [B1[0], B2[0], B3[0], C[0]];
  const pathOf = (k) => { // the line up to progress k (0..1 of its points), as an SVG path
    const n = pts.length - 1, f = k * n, i = Math.floor(f), r = f - i;
    const out = pts.slice(0, i + 1).map((p) => p.slice());
    if (i < n) out.push([lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]);
    return out;
  };

  return (t, f) => {
    const on = t >= S.problem[0] && t <= S.problem[1];
    set(root, { vis: on });
    if (!on) return;
    const ft = f / FPS;
    // the hole: from CUE.hole the frame freezes (time stops for everything but a slow push) and darkens
    const frozen = t >= CUE.hole;
    const tt = frozen ? CUE.hole : t;
    const holeP = P(t, CUE.hole, CUE.turn, ease.inOutSine);

    // a glitch at every cut: a jitter, a red split, a flash
    let gl = 0;
    for (const c of cuts) if (tt >= c - 0.02 && tt < c + 0.16) gl = 1 - (tt - c) / 0.18;
    const gq = Math.floor(ft * 30);
    const jx = gl ? (hash(gq, 7) - 0.5) * 60 * U * gl : 0;
    const jy = gl ? (hash(gq, 9) - 0.5) * 16 * U * gl : 0;
    root.style.filter = gl > 0.05 ? `drop-shadow(${(8 * gl * U).toFixed(1)}px 0 0 rgba(255,40,90,.7)) drop-shadow(${(-8 * gl * U).toFixed(1)}px 0 0 rgba(40,220,255,.45))` : (frozen ? `saturate(${(1 - 0.6 * holeP).toFixed(3)}) brightness(${(1 - 0.55 * holeP).toFixed(3)})` : 'none');

    const beatPulse = Math.exp(-((tt % BEAT) / BEAT) * 5);
    set(red, { o: 0.6 + 0.4 * beatPulse });
    set(grid, { y: (tt * 30 * U) % (90 * U), o: 1 });

    // ---- A: hook
    const inA = tt < A[1] + 0.05;
    if (!inA) { for (const e of [tank, lead, days, daily, ...drips, ...big.map((x) => x.d)]) set(e, { vis: false }); }
    if (inA) {
      // the liquid level falls from the top of the R$ to its foot, with a wobbling surface
      const lvl = lerp(80, 760, P(tt, 0, CUE.noshow, ease.inOutSine) * 0.85 + 0.05);
      let d = `M0 900 L0 ${lvl}`;
      for (let x = 0; x <= 1080; x += 40) d += ` L${x} ${(lvl + Math.sin(x * 0.02 + tt * 7) * 14 + Math.sin(x * 0.05 - tt * 11) * 6).toFixed(1)}`;
      liquid.setAttribute('d', `${d} L1080 900 Z`);
      const tankY = 730 * U;
      set(tank, { vis: true, x: 0, y: tankY - 60 * U * P(tt, 0, 2, ease.outCubic), o: 0.9 });
      drips.forEach((dd, i) => {
        const period = 0.9, ph = ((tt + i * 0.37) % period) / period;
        set(dd, { vis: true, x: W * (0.32 + 0.09 * i) + 10 * U * Math.sin(i), y: tankY + 760 * U * 0.98 + ph * 520 * U, sy: 1 + ph, o: 1 - ph });
      });
      // the words: the lead rises from frame 0, PERDENDO and DINHEIRO slam on their words
      const ly = 300 * U;
      set(lead, { vis: true, x: W / 2 - leadW / 2, y: ly + 90 * U * (1 - P(tt, 0, 0.5, ease.snap)), o: P(tt, 0, 0.12) });
      const hits = [WORDAT('hook', 'perdendo'), CUE.money];
      big.forEach((x, i) => {
        const s = slam(tt, hits[i], { from: 1.9, dur: 0.22 });
        set(x.d, { vis: true, x: W / 2 - x.w / 2, y: ly + 110 * U + i * x.h * 0.95, s: s.s, o: s.o });
      });
      // TODOS OS DIAS: the weekday strip races in, each chip turns red as it passes the centre
      const dIn = P(tt, CUE.daily - 0.15, CUE.daily + 0.3, ease.outExpo);
      const run = (tt - CUE.daily) * 520 * U;
      set(days, { vis: true, x: 0, y: 1580 * U, o: dIn });
      chips.forEach((c, i) => {
        const x = W / 2 - 75 * U + (i - 3) * 180 * U - run + (1 - dIn) * 900 * U;
        const hot = x < W / 2 + 60 * U;
        c.style.background = hot ? 'var(--problem)' : 'transparent';
        c.style.borderColor = hot ? 'var(--problem)' : 'rgba(255,255,255,.18)';
        set(c, { x, y: 0, o: 1 });
      });
      const ds = slam(tt, CUE.daily, { from: 1.5, dur: 0.2 });
      set(daily, { vis: true, x: W / 2 - dailyW / 2, y: 1765 * U, s: ds.s, o: ds.o });
    }

    // ---- B1: the agenda
    const in1 = tt >= B1[0] && tt < B1[1];
    if (!in1) set(p1, { vis: false });
    if (in1) {
      const d = tt - B1[0];
      set(p1, { vis: true, x: 0, y: 0, o: 1 });
      const ts = slam(tt, B1[0] + 0.02, { from: 1.4 });
      set(t1, { x: W / 2 - t1w / 2, y: 250 * U, s: ts.s, o: ts.o });
      set(ag, { x: (W - agW) / 2, y: 520 * U + 140 * U * (1 - ease.outExpo(clamp(d / 0.5))), r: -2 + 2 * ease.outExpo(clamp(d / 0.5)), o: clamp(d / 0.12) });
      rows.forEach((r, i) => {
        const k = failing.indexOf(i);
        const at = k < 0 ? 1e9 : failAt[k];
        const st = slam(tt, at, { from: 2.2, dur: 0.18, overshoot: 0.1 });
        set(r.stamp, { x: 0, y: 0, s: st.s, r: -6, o: st.o });
        r.r.style.background = tt >= at ? 'rgba(204,51,102,.16)' : 'rgba(255,255,255,.05)';
        set(r.bar, { x: 0, y: 0, o: tt >= at ? 0.35 : 1 });
      });
    }

    // ---- B2: the budget slides into the drawer and fades
    const in2 = tt >= B2[0] && tt < B2[1];
    if (!in2) set(p2, { vis: false });
    if (in2) {
      const d = tt - B2[0];
      set(p2, { vis: true, x: 0, y: 0, o: 1 });
      t2.forEach((x, i) => { const s = slam(tt, B2[0] + 0.02 + i * b(1), { from: 1.5 }); set(x.d, { x: W / 2 - x.w / 2, y: (230 + i * 135) * U, s: s.s, o: s.o }); });
      const dy = 1330 * U;
      set(drawer, { x: (W - 880 * U) / 2, y: dy, o: 1 });
      // in from the right, a hold, then pushed down into the drawer and swallowed, greying
      const inP = ease.outExpo(clamp(d / 0.45));
      const sink = P(tt, WORDAT('chaos', 'gaveta'), CUE.whats - 0.35, ease.inOutCubic);
      bud.style.filter = `grayscale(${sink.toFixed(2)}) brightness(${(1 - 0.5 * sink).toFixed(2)})`;
      bud.style.clipPath = sink > 0 ? `inset(0 0 ${(sink * 100).toFixed(1)}% 0)` : 'none';
      set(bud, { x: (W - budW) / 2 + (1 - inP) * W, y: 680 * U + sink * (dy - 680 * U + 40 * U), r: (1 - inP) * 10 + 3 * Math.sin(d * 2), o: 1 });
    }

    // ---- B3: the phone floods
    const in3 = tt >= B3[0] && tt < B3[1];
    if (!in3) set(p3, { vis: false });
    if (in3) {
      const d = tt - B3[0];
      set(p3, { vis: true, x: 0, y: 0, o: 1 });
      t3.forEach((x, i) => { const s = slam(tt, B3[0] + 0.02 + i * b(1), { from: 1.5 }); set(x.d, { x: W / 2 - x.w / 2, y: (200 + i * 135) * U, s: s.s, o: s.o }); });
      const px = (W - phW) / 2, py = 560 * U + 120 * U * (1 - ease.outExpo(clamp(d / 0.5)));
      set(phone, { x: px, y: py, r: 0, o: 1 });
      // bubbles pop in at the bottom one after another and push the stack up
      let n = 0;
      bubbles.forEach((bb, i) => { if (tt >= bubbleAt(i)) n = i + 1; });
      let y = phH - 60 * U;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const bb = bubbles[i];
        if (i >= n) { set(bb.d, { o: 0 }); continue; }
        const pop = ease.outBack(clamp((tt - bubbleAt(i)) / 0.2));
        y -= (bb.h + 18 * U) * pop;
        set(bb.d, { x: 30 * U, y, s: 0.6 + 0.4 * pop, o: clamp(pop * 2), origin: '0% 100%' });
      }
      const count = Math.min(99, Math.floor(clamp((ft - CUE.whats) / (CUE.broke - CUE.whats)) * 140));
      badge.textContent = count >= 99 ? '99+' : String(Math.max(1, count));
      const bs = slam(tt, CUE.whats + 0.1, { from: 0.2, dur: 0.25 });
      const beat = Math.exp(-((tt % BEAT) / BEAT) * 6);
      set(badge, { x: px + phW - 70 * U, y: py - 40 * U, s: bs.s * (1 + 0.12 * beat), o: bs.o });
    }

    // ---- C: the cash line falls, A CONTA NÃO FECHA
    const inC = tt >= C[0];
    if (!inC) set(p4, { vis: false });
    if (inC) {
      set(p4, { vis: true, x: 0, y: 0, o: 1 });
      const k = 0.18 + 0.82 * P(tt, C[0], CUE.nofecha + 0.3, ease.inOutSine); // already drawn in part on the cut: no empty frame
      const pp = pathOf(k);
      const d = pp.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
      ln.setAttribute('d', d);
      area.setAttribute('d', `${d} L${pp[pp.length - 1][0].toFixed(1)} 900 L60 900 Z`);
      const last = pp[pp.length - 1];
      dot.setAttribute('cx', last[0].toFixed(1)); dot.setAttribute('cy', Math.min(last[1], 940).toFixed(1));
      set(chart, { x: 0, y: 820 * U, o: 1 });
      broke.forEach((x, i) => {
        const at = i ? CUE.nofecha : C[0];
        const s = slam(tt, at, { from: i ? 2 : 1.5, dur: 0.22 });
        set(x.d, { x: W / 2 - x.w / 2, y: (330 + i * 150) * U, s: s.s * (1 + 0.05 * holeP), o: s.o });
      });
    }

    // camera: hits shake it, a slow push all along, a creep in during the hole
    const sh = shakes(tt, [WORDAT('hook', 'perdendo'), CUE.money, CUE.daily, ...failAt, CUE.budget, WORDAT('chaos', 'gaveta'), CUE.whats, CUE.nofecha], 14, 0.35);
    const push = 1 + 0.03 * Math.sin(tt * 0.6) + 0.06 * holeP;
    set(cam, { x: sh.x + jx, y: sh.y + jy, r: sh.r, s: push });
    set(fl, { o: Math.max(flash(t, CUE.money, 0.12, 0.25), flash(t, CUE.nofecha, 0.14, 0.35), ...cuts.map((c) => flash(t, c, 0.08, 0.18))) });
    if (t > CUE.whats && t < CUE.broke) drawSpeedLines(ctx.fx, t, { seed: 3, n: 14, vertical: true, dir: -1, alpha: 0.12, speed: 2600, color: '204,51,102' });
  };
}
