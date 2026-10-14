// The flow — the patient's journey from the site's own diagram ("Paciente baixa o App → Escolhe a clínica → Solicita a
// consulta → Atendimento realizado"), rebuilt for 9:16 as a zig-zag path: a line draws from node to node with a light
// travelling on it, and each node lights on its verb in the narration. Then "Lembretes, termos, receitas e
// pagamentos chegam direto no celular dele": the journey whips up out of frame, the patient's phone (the real app
// mock-up) rises, and the site's real notifications drop onto it one per word, each with its chime.
import { el, set, P, ease, clamp, lerp, svgEl } from '../engine.js';
import { CUE, S, BEAT, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, fitFont, slam, shakes, whip, ring, drawSpeedLines } from '../kit.js';
import { ground, chevClip, chevBands, icon, checkSvg } from '../brand.js';
import { patientPhone, notification } from '../ui.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '4';
  const bg = ground(root, { seed: 7 });
  const cam = el('div', 'layer', root);
  const bands = chevBands(root);

  // ---- part A: the journey
  const A = el('div', 'layer', cam);
  const title = TX.flow.title.map((w, i) => {
    const d = el('div', `kin${i ? ' green' : ''}`, A, w);
    d.style.fontSize = `${120 * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });
  const N = [[250, 660], [830, 960], [250, 1260], [830, 1560]].map(([x, y]) => [x * U, y * U]);
  const path = `M${N[0][0]} ${N[0][1]} C ${N[0][0] + 380 * U} ${N[0][1]}, ${N[1][0] - 380 * U} ${N[1][1]}, ${N[1][0]} ${N[1][1]}
    C ${N[1][0] - 380 * U} ${N[1][1]}, ${N[2][0] + 380 * U} ${N[2][1]}, ${N[2][0]} ${N[2][1]}
    C ${N[2][0] + 380 * U} ${N[2][1]}, ${N[3][0] - 380 * U} ${N[3][1]}, ${N[3][0]} ${N[3][1]}`;
  const lines = svgEl(`<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <path d="${path}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="${6 * U}" stroke-dasharray="${14 * U} ${14 * U}"/>
    <path class="draw" d="${path}" fill="none" stroke="#2f7fdd" stroke-width="${10 * U}" stroke-linecap="round"/>
    <circle class="spark" r="${16 * U}" fill="#60de80"/></svg>`, A);
  const draw = lines.querySelector('.draw'), spark = lines.querySelector('.spark');
  const LEN = draw.getTotalLength();
  draw.style.strokeDasharray = `${LEN}`;
  // where along the path each node sits (search the length whose point is nearest)
  const lenAt = N.map(([x, y]) => { let best = 0, bd = 1e9; for (let l = 0; l <= LEN; l += 4) { const p = draw.getPointAtLength(l); const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = l; } } return best; });
  const at = [CUE.step1, CUE.step2, CUE.step3, CUE.step4];
  const icons = ['phone', 'pin', 'cal', 'user'];
  const NR = 120 * U;
  const nodes = N.map(([x, y], i) => {
    const n = el('div', 'abs', A);
    Object.assign(n.style, { width: `${2 * NR}px`, height: `${2 * NR}px`, borderRadius: '50%', display: 'grid', placeItems: 'center', boxSizing: 'border-box' });
    n.innerHTML = icon(icons[i], 118 * U, 'currentColor', 3);
    const lab = el('div', 'abs', A, `${TX.flow.steps[i][0]}<br><b>${TX.flow.steps[i][1]}</b>`);
    Object.assign(lab.style, { padding: `${20 * U}px ${30 * U}px`, borderRadius: `${20 * U}px`, border: `${3 * U}px solid var(--accent)`, background: 'rgba(7,20,53,.75)',
      font: `500 ${48 * U}px/1.2 var(--display)`, color: 'var(--accent)', whiteSpace: 'nowrap' });
    lab.querySelector('b').style.fontWeight = '800';
    const lw = lab.offsetWidth, lh = lab.offsetHeight;
    const rg = ring(A, NR * 1.25, 6 * U, 'var(--accent)');
    return { n, lab, lw, lh, x, y, rg, side: i % 2 ? -1 : 1 };
  });
  const done = el('div', 'abs', A, checkSvg(120 * U));

  // ---- part B: the phone and the notifications
  const B = el('div', 'layer', cam);
  const nt = TX.notify.title.map((w, i) => {
    const d = el('div', `kin${i ? ' green' : ''}`, B, w);
    d.style.fontSize = `${120 * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });
  const phW = 640 * U;
  const swap0 = CUE.notify - b(1.5);
  const app = patientPhone(B, { at: swap0 + 0.35 }); // the patient's app, rebuilt live (js/ui.js)
  const phS = (phW / app.w);
  const notifW = 920 * U;
  // the site's own notifications (brand/img/08-image.png), rebuilt — one per word of the narration
  const notifs = [
    { title: 'Olá, Leonardo Reis!', text: 'Passando para te lembrar da sua consulta, agendada para hoje às 13:00. Acesse para confirmar sua presença!', time: 'agora' },
    { title: 'Olá, Leonardo!', text: 'Você tem um novo Termo para assinar. Clique aqui para visualizar.', time: 'há 2m' },
    { title: 'Receita gerada', text: 'Uma nova receita foi gerada para você. Pague agora e ganhe 10% de desconto!', time: 'há 1m' },
    { title: 'Recebemos seu pagamento', text: 'Sua receita foi paga com sucesso. Obrigado.', time: 'agora' },
  ].map((n) => notification(B, n, notifW));
  const nh = notifs.map((n) => n.offsetHeight);
  const nAt = [CUE.n1, CUE.n2, CUE.n3, CUE.n4];
  const words = TX.notify.words.map((w) => {
    const d = el('div', 'abs', B, w);
    Object.assign(d.style, { font: `800 ${44 * U}px/1 var(--display)`, color: '#071435', background: 'var(--accent)', padding: `${14 * U}px ${26 * U}px`, borderRadius: `${40 * U}px`, whiteSpace: 'nowrap' });
    return { d, w: d.offsetWidth };
  });

  const enter = [S.flow[0], S.flow[0] + b(1.1)];
  const swap = CUE.notify - b(1.5); // the journey whips up, the phone rises
  return (t, f) => {
    const on = t >= S.flow[0] && t <= S.flow[1];
    set(root, { vis: on });
    if (!on) return;
    const sp = P(t, enter[0], enter[1], ease.inOutSine);
    root.style.clipPath = chevClip(sp);
    bands(sp);
    bg(t, { pulse: Math.exp(-((t % BEAT) / BEAT) * 5) });

    // ---- A
    const outA = whip(t, swap, b(1), H * 1.1, 'out');
    const inA = t < swap + b(1);
    if (!inA) set(A, { vis: false });
    else {
      set(A, { vis: true, x: 0, y: outA, o: 1 });
      let y = 220 * U;
      title.forEach((x, i) => { const s = slam(t, S.flow[0] + 0.2 + i * b(1), { from: 1.5 }); set(x.d, { x: W / 2 - x.w / 2, y, s: s.s, o: s.o }); y += x.h * 0.92; });
      // the line reaches each node on its word; the light rides its head
      const ks = [[CUE.flow, 0], ...at.map((a, i) => [a, lenAt[i]])];
      let L = 0;
      for (let i = 1; i < ks.length; i++) if (t >= ks[i - 1][0]) L = lerp(ks[i - 1][1], ks[i][1], ease.inOutCubic(clamp((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0]))));
      draw.style.strokeDashoffset = `${LEN - L}`;
      const hp = draw.getPointAtLength(Math.max(0.1, L));
      spark.setAttribute('cx', hp.x.toFixed(1)); spark.setAttribute('cy', hp.y.toFixed(1));
      set(spark, { o: t > CUE.flow && t < CUE.step4 + 0.2 ? 1 : 0 });
      nodes.forEach((nd, i) => {
        const appear = ease.outBack(clamp((t - (S.flow[0] + 0.5 + i * 0.12)) / 0.4));
        const lit = t >= at[i];
        const s = lit ? slam(t, at[i], { from: 1.35, dur: 0.2 }).s : 1;
        nd.n.style.background = lit ? 'var(--accent-2)' : 'rgba(255,255,255,.06)';
        nd.n.style.border = `${4 * U}px solid ${lit ? 'var(--accent-2)' : 'rgba(255,255,255,.25)'}`;
        nd.n.style.color = lit ? '#fff' : 'rgba(255,255,255,.55)';
        nd.n.style.boxShadow = lit ? '0 0 60px rgba(47,127,221,.7)' : 'none';
        set(nd.n, { x: nd.x - NR, y: nd.y - NR, s: appear * s, o: clamp(appear * 2) });
        const lp = ease.snap(clamp((t - at[i] + 0.1) / 0.4));
        const lx = nd.side > 0 ? nd.x + NR + 30 * U : nd.x - NR - 30 * U - nd.lw;
        set(nd.lab, { x: lx + (1 - lp) * 120 * U * nd.side, y: nd.y - nd.lh / 2, o: lp });
        const rp = P(t, at[i], at[i] + 0.6, ease.outCubic);
        set(nd.rg, { x: nd.x - NR * 1.25 - 20 * U, y: nd.y - NR * 1.25 - 20 * U, s: 0.8 + 0.7 * rp, o: lit ? 0.9 * (1 - rp) : 0 });
      });
      const dp = slam(t, CUE.step4 + 0.25, { from: 0.2, dur: 0.3, overshoot: 0.1 });
      set(done, { x: N[3][0] + NR * 0.35, y: N[3][1] - NR * 1.35, s: dp.s, o: dp.o });
    }

    // ---- B
    const inB = t >= swap;
    if (!inB) set(B, { vis: false });
    else {
      const rp = ease.snap(clamp((t - swap - 0.15) / 0.8));
      set(B, { vis: true, x: 0, y: 0, o: 1 });
      let y = 200 * U;
      nt.forEach((x, i) => { const s = slam(t, swap + 0.3 + i * b(1), { from: 1.5 }); set(x.d, { x: W / 2 - x.w / 2, y, s: s.s, o: s.o }); y += x.h * 0.92; });
      const py = 560 * U + (1 - rp) * 1300 * U;
      app.frame(t, f / 60, { x: (W - phW) / 2, y: py - 20 * U * Math.sin((t - swap) * 1.3), s: phS, rx: lerp(35, 6, rp), o: 1 });
      // the notifications drop in from above the phone and stack, newest on top
      let sy = 975 * U; // under the app's greeting, so "Olá Thaina Lucas" stays readable
      for (let i = notifs.length - 1; i >= 0; i--) {
        const d = t - nAt[i];
        if (d < 0) { set(notifs[i], { o: 0 }); continue; }
        const p = ease.outBack(clamp(d / 0.35));
        // each newer card pushes the older ones down
        let push = 0;
        for (let j = i + 1; j < notifs.length; j++) push += (nh[j] + 14 * U) * ease.outCubic(clamp((t - nAt[j]) / 0.3));
        set(notifs[i], { x: (W - notifW) / 2, y: sy + push - (1 - p) * 260 * U, s: 0.85 + 0.15 * p, o: clamp(d / 0.1) });
        const wd = words[i];
        const wp = slam(t, nAt[i], { from: 1.6, dur: 0.2 });
        set(wd.d, { x: i % 2 ? W - wd.w - 60 * U : 60 * U, y: 1690 * U + Math.floor(i / 2) * 105 * U, s: wp.s, o: wp.o });
      }
      for (let i = 0; i < words.length; i++) if (t < nAt[i]) set(words[i].d, { o: 0 });
    }

    const sh = shakes(t, [...at, ...nAt], 9, 0.28);
    set(cam, { x: sh.x, y: sh.y, r: sh.r, s: 1 + 0.025 * Math.sin((t - S.flow[0]) * 0.4) });
    if (t > swap - 0.05 && t < swap + b(1) + 0.1) drawSpeedLines(ctx.fx, t, { seed: 23, n: 50, vertical: true, dir: -1, alpha: 0.4, speed: 8000 });
  };
}
