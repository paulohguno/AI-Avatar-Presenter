// Agents: "Agentes automáticos confirmam consultas, recuperam faltosos e trazem de volta orçamentos não aprovados.
// Tudo pelo WhatsApp." The product's Agents screen, rebuilt live (js/ui.js agentsScreen): the list slides in row by
// row; each agent lights green "Ativo" on its verb — Lembrete/Confirmação on "confirmam", Faltosos on "recuperam",
// Orçamento on "trazem de volta"; then the site's "Nova regra de Orcamento" modal opens, the notification is picked,
// the title and the message type themselves, and "Adicionar" is clicked as the narration says "Tudo pelo WhatsApp".
import { el, set, P, ease } from '../engine.js';
import { CUE, S, BEAT, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, U, fitFont, slam, shakes, drawSpeedLines } from '../kit.js';
import { ground, chevClip, chevBands, icon } from '../brand.js';
import { agentsScreen } from '../ui.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '3';
  const bg = ground(root, { seed: 5 });
  const cam = el('div', 'layer', root);
  const bands = chevBands(root);

  const title = TX.agents.title.map((w, i) => {
    const d = el('div', `kin${i ? ' green' : ''}`, cam, w);
    d.style.fontSize = `${(i ? 130 : 120) * U}px`;
    return { d, w: fitFont(d, W * 0.9), h: d.offsetHeight };
  });
  const open = CUE.bring + 0.15, typeAt = open + 0.75, addAt = CUE.viaWa - 0.1;
  const ui = agentsScreen(cam, { at: S.agents[0] + 0.15, open, typeAt, addAt, lit: [[CUE.confirm, 3], [CUE.recover, 1], [CUE.bring, 2]] });
  const pill = el('div', 'abs', cam, `${icon('chat', 56 * U, '#071435', 4)}<span>${TX.agents.via}</span>`);
  Object.assign(pill.style, { display: 'flex', alignItems: 'center', gap: `${20 * U}px`, padding: `${26 * U}px ${44 * U}px`, borderRadius: `${70 * U}px`,
    background: 'var(--accent)', color: '#071435', font: `800 ${46 * U}px/1 var(--display)`, whiteSpace: 'nowrap', boxShadow: '0 20px 60px rgba(96,222,128,.35)', zIndex: '25' });
  const pillW = pill.offsetWidth;

  const enter = [S.agents[0], S.agents[0] + b(1.1)];
  return (t, f) => {
    const on = t >= S.agents[0] && t <= S.agents[1];
    set(root, { vis: on });
    if (!on) return;
    const sp = P(t, enter[0], enter[1], ease.inOutSine);
    root.style.clipPath = chevClip(sp);
    bands(sp);
    bg(t, { pulse: Math.exp(-((t % BEAT) / BEAT) * 5) });
    const ft = f / 60;

    let y = 200 * U;
    title.forEach((x, i) => {
      const t0 = i ? CUE.agents + 0.4 : S.agents[0] + 0.15;
      const s = slam(t, t0, { from: 1.5 });
      set(x.d, { x: W / 2 - x.w / 2, y, s: s.s, o: s.o });
      y += x.h * 0.92;
    });
    // the screen drifts gently; the modal floats over its lower half
    const drift = 14 * Math.sin((t - S.agents[0]) * 0.7);
    ui.frame(t, ft, { x: (W - 980 * U) / 2, y: 470 * U + drift, s: U, mx: (W - 880 * 1.16 * U) / 2, my: 880 * U - drift, ms: 1.16 * U });
    const ps = slam(t, CUE.viaWa, { from: 0.3, dur: 0.3, overshoot: 0.08 });
    set(pill, { x: W / 2 - pillW / 2, y: 1450 * U, s: ps.s, o: ps.o });

    const sh = shakes(t, [CUE.agents + 0.4, CUE.confirm, CUE.recover, CUE.bring, CUE.viaWa], 8, 0.3);
    set(cam, { x: sh.x, y: sh.y, r: sh.r, s: 1 + 0.03 * P(t, S.agents[0], S.agents[1]) });
    if (sp > 0 && sp < 1) drawSpeedLines(ctx.fx, t, { seed: 17, n: 40, dir: 1, alpha: 0.35, speed: 8000, color: '96,222,128' });
  };
}
