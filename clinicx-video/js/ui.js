// The Clinicx product, rebuilt as live HTML from the site's own mock-ups (brand/img/*.png) — the same layout, labels,
// values and colours, but every part of it moves: menus slide in item by item, text types, numbers count, bars grow,
// cards fly in, a cursor clicks. Each builder returns { el, w, h, frame(t, ft) }: frame() is a pure function of the
// time (ft = the frame's own time, for text that changes) and writes every animated property each frame.
import { el, set, svgEl, clamp, lerp, ease, P } from './engine.js';
import { slam } from './kit.js';

const BLUE = '#2f7fdd', LINK = '#1f6fd6', INK = '#3a3f4a', MUTED = '#6b7280', LINE = '#e6eaf0', BG = '#f3f6fb';
const pop = (t, t0, d = 0.35) => ease.outBack(clamp((t - t0) / d));
const snapIn = (t, t0, d = 0.45) => ease.snap(clamp((t - t0) / d));
const fade = (t, t0, d = 0.15) => clamp((t - t0) / d);
/** Text typed from t0 at `cps` characters per second (computed from the frame's own time). */
export const typed = (str, ft, t0, cps = 28) => str.slice(0, Math.max(0, Math.min(str.length, Math.floor((ft - t0) * cps))));
const count = (ft, t0, dur, to) => Math.round(to * ease.outCubic(clamp((ft - t0) / dur)));
const css = (e, o) => Object.assign(e.style, o);
const box = (parent, o = {}, html) => { const e = el('div', 'abs', parent, html); css(e, o); return e; };

// solid icons in the dashboard's style (blue, filled)
const SOLID = {
  cal: '<rect x="4" y="7" width="40" height="37" rx="5"/><rect x="11" y="2" width="5" height="10" rx="2"/><rect x="32" y="2" width="5" height="10" rx="2"/><g fill="#fff"><rect x="10" y="20" width="6" height="5"/><rect x="21" y="20" width="6" height="5"/><rect x="32" y="20" width="6" height="5"/><rect x="10" y="30" width="6" height="5"/><rect x="21" y="30" width="6" height="5"/><rect x="32" y="30" width="6" height="5"/></g>',
  users: '<circle cx="15" cy="13" r="7"/><circle cx="33" cy="13" r="7"/><path d="M2 38c0-9 6-14 13-14s13 5 13 14z"/><path d="M22 38c0-9 5-14 11-14 7 0 13 5 13 14z"/><circle cx="39" cy="37" r="8" fill="#fff"/><path d="M39 31v12M33 37h12" stroke="currentColor" stroke-width="3"/>',
  money: '<rect x="2" y="10" width="44" height="28" rx="4"/><circle cx="24" cy="24" r="7" fill="#fff"/><circle cx="24" cy="24" r="3.5"/><circle cx="9" cy="24" r="2.5" fill="#fff"/><circle cx="39" cy="24" r="2.5" fill="#fff"/>',
  archive: '<rect x="3" y="6" width="42" height="10" rx="2"/><path d="M6 19h36v22a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><rect x="18" y="24" width="12" height="4" rx="2" fill="#fff"/>',
  x: '<path d="M8 6h8l10 18-10 18H8l10-18z"/><path d="M20 6h8l10 18-10 18h-8l10-18z" opacity=".75"/>',
};
const solid = (k, s, c = BLUE) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="${c}" style="color:${c}">${SOLID[k]}</svg>`;
const MENU_ICON = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 20 20" fill="#4b5563"><rect x="3" y="4" width="14" height="12" rx="2"/></svg>`;
const chevron = (s, c = '#9aa3af') => `<svg width="${s}" height="${s}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4l6 6-6 6"/></svg>`;
const down = (s, c = '#6b7280') => `<svg width="${s}" height="${s}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M5 8l5 5 5-5"/></svg>`;

/** The mouse pointer. */
export function cursor(parent, s = 46) {
  const c = svgEl(`<svg class="abs" width="${s}" height="${s * 1.3}" viewBox="0 0 24 31" style="z-index:20;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))"><path d="M2 2l19 17h-9l5 10-4 2-5-10-6 6z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`, parent);
  const ring = box(parent, { width: `${s * 1.4}px`, height: `${s * 1.4}px`, borderRadius: '50%', border: `${s / 12}px solid ${BLUE}`, zIndex: 19 });
  return { c, ring, s };
}

// ---- the dashboard (brand/img/07-image.png) — design size 1460 × 840 ----------------------------------------------
export async function dashboard(parent, { at = 0 } = {}) {
  const W = 1460, H = 840;
  const root = box(parent, { width: `${W}px`, height: `${H}px`, borderRadius: '22px', background: BG, boxShadow: '0 40px 120px rgba(2,8,30,.55)', overflow: 'hidden', transformOrigin: '0 0', color: INK, fontFamily: 'var(--display)' });
  // top bar
  const top = box(root, { left: 0, top: 0, width: `${W}px`, height: '64px', display: 'flex', alignItems: 'center', gap: '26px', padding: '0 28px', boxSizing: 'border-box' },
    `<svg width="26" height="20" viewBox="0 0 26 20" fill="#4b5563"><rect width="26" height="3" rx="1.5"/><rect y="8" width="26" height="3" rx="1.5"/><rect y="16" width="26" height="3" rx="1.5"/></svg>`);
  const j = await (await fetch('assets/logo.json')).json();
  const lw = 150, lh = (lw * j.h) / j.w;
  top.insertAdjacentHTML('beforeend', `<svg width="${lw}" height="${lh}" viewBox="0 0 ${j.w} ${j.h}">${j.shapes.map((s, i) => `<path d="${s.d}" fill="${i >= 8 ? '#60de80' : BLUE}"/>`).join('')}</svg>`);
  const topR = box(root, { left: `${W - 170}px`, top: '14px', display: 'flex', gap: '18px', alignItems: 'center' },
    `<div style="width:34px;height:34px;border-radius:50%;background:#4b5563;color:#fff;font:700 20px/34px var(--display);text-align:center">?</div>
     <div style="width:34px;height:34px;border-radius:50%;background:#e5edf8;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M14 13A7 7 0 0 1 7 3a7 7 0 1 0 7 10z" fill="${LINK}"/></svg></div>
     <div style="width:42px;height:42px;border-radius:50%;background:#1f2937;color:#fff;font:700 15px/42px var(--display);text-align:center;position:relative">AD<i style="position:absolute;right:-1px;bottom:1px;width:11px;height:11px;border-radius:50%;background:#22c55e;border:2px solid #fff"></i></div>`);
  // sidebar
  const side = box(root, { left: '14px', top: '72px', width: '212px', height: `${H - 86}px`, borderRadius: '12px', background: '#fff' });
  const items = ['Início', 'Gestão da clinica', 'Agenda', 'Atendimento', 'Pacientes', 'CRC', 'Financeiro', 'Marketing', 'Agentes', 'Usuários', 'Configurações'];
  const menu = items.map((txt, i) => {
    const r = box(side, { left: '8px', top: `${16 + i * 38}px`, width: '196px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px', boxSizing: 'border-box', font: '500 15px/1 var(--display)', color: '#374151' },
      `${MENU_ICON(16)}<span>${txt}</span>${['CRC', 'Financeiro', 'Marketing'].includes(txt) ? `<span style="margin-left:auto">${down(14)}</span>` : ''}`);
    return r;
  });
  box(side, { left: '20px', top: `${H - 86 - 92}px`, font: '500 15px/1 var(--display)', color: '#374151', display: 'flex', gap: '12px', alignItems: 'center' }, `${solid('x', 16, '#374151')}Clinicx`);
  box(side, { left: '20px', top: `${H - 86 - 46}px`, font: '500 15px/1 var(--display)', color: '#374151', display: 'flex', gap: '12px', alignItems: 'center' }, `${MENU_ICON(16)}Suporte`);
  // greeting
  const greet = box(root, { left: '240px', top: '72px', width: `${W - 254}px`, height: '96px', borderRadius: '12px', background: 'linear-gradient(90deg,#fff 60%,#eaf3fd)' });
  const hello = box(greet, { left: '28px', top: '24px', font: `500 22px/1 var(--display)`, color: LINK, whiteSpace: 'pre' });
  const today = box(greet, { left: '28px', top: '58px', font: '500 14px/1 var(--display)', color: '#374151' }, 'Hoje é dia 1 de outubro de 2025');
  const quote = box(greet, { right: '30px', left: 'auto', top: '40px', font: '400 15px/1 var(--display)', color: '#374151' }, '"Todos os dias me levanto para vencer". (Onassis)');
  // module cards
  const mods = [['cal', 'Agenda', 'Gerencie e agende os compromissos de médicos e pacientes de forma eficiente.'], ['users', 'Pacientes', 'Armazena informações dos pacientes, possibilitando um atendimento mais eficaz.'],
    ['money', 'Financeiro', 'Gerencie controle de receitas e despesas, acompanhe o desempenho financeiro e outros.'], ['archive', 'Relatório', 'Possibilita uma análise dos desempenhos da clínica e dos pacientes atendidos.']];
  const mw = (W - 254 - 3 * 14) / 4;
  const cards = mods.map(([ic, name, desc], i) => {
    const c = box(root, { left: `${240 + i * (mw + 14)}px`, top: '182px', width: `${mw}px`, height: '218px', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 10px rgba(15,30,60,.06)', textAlign: 'center' },
      `<div style="margin-top:24px">${solid(ic, 34)}</div><div style="font:500 20px/1 var(--display);color:#111827;margin-top:10px">${name}</div>
       <div style="font:400 13.5px/1.35 var(--display);color:#4b5563;margin:16px 24px 0;height:56px">${desc}</div>
       <div class="btn" style="margin:12px 24px 0;border:1.5px solid ${LINK};border-radius:4px;color:${LINK};font:500 15px/30px var(--display)">Acessar</div>`);
    c.style.transformOrigin = '50% 50%';
    return { c, btn: c.querySelector('.btn') };
  });
  // stats
  const stats = [['Total de pacientes', 864, 'Pacientes'], ['Total de profissionais', 14, 'Profissionais'], ['Total de agendamentos', 1709, 'Agendamentos']];
  const sw = (W - 254 - 2 * 14) / 3;
  const statEls = stats.map(([lab, n, unit], i) => {
    const c = box(root, { left: `${240 + i * (sw + 14)}px`, top: '414px', width: `${sw}px`, height: '86px', borderRadius: '12px', background: 'linear-gradient(90deg,#fff 70%,#eaf7f3)' },
      `<div style="position:absolute;left:20px;top:18px;font:500 14px/1 var(--display);color:#111827">${lab}</div>`);
    const v = box(c, { left: '20px', top: '46px', font: '500 21px/1 var(--display)', color: '#2b8ad8', whiteSpace: 'pre' });
    return { c, v, n, unit };
  });
  // chart
  const chart = box(root, { left: '240px', top: '514px', width: `${W - 254}px`, height: `${H - 528}px`, borderRadius: '12px', background: '#fff' },
    `<div style="position:absolute;left:22px;top:22px;font:500 20px/1 var(--display);color:#111827">Volume de Atendimentos</div>`);
  const CH = H - 528, base = CH - 46, unit = (base - 70) / 40;
  [0, 10, 20, 30, 40].forEach((v) => box(chart, { left: '22px', top: `${base - v * unit - 7}px`, font: '400 12px/1 var(--display)', color: '#374151' }, String(v)));
  [0, 10, 20, 30, 40].forEach((v) => box(chart, { left: '56px', top: `${base - v * unit}px`, width: `${W - 254 - 90}px`, height: '1px', background: v ? '#f1f3f6' : '#e5e7eb' }));
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const vals = [[0, 0], [31, 15], [0, 19], [1, 0], [0, 38], [0, 13], [0, 21]]; // [blue, grey] as on the site's chart
  const dx = (W - 254 - 130) / 7;
  const bars = [];
  days.forEach((d, i) => {
    const cx = 100 + i * dx + dx / 2;
    box(chart, { left: `${cx - 20}px`, top: `${base + 10}px`, width: '40px', textAlign: 'center', font: '400 12px/1 var(--display)', color: '#374151' }, d);
    vals[i].forEach((v, k) => { if (!v) return; const bb = box(chart, { left: `${cx - 22 + k * 26}px`, top: `${base - v * unit}px`, width: '20px', height: `${v * unit}px`, borderRadius: '10px 10px 0 0', background: k ? '#6b7a90' : BLUE, transformOrigin: '50% 100%' }); bars.push({ bb, i, k }); });
  });
  // floating cards (they hang over the right edge, as on the site)
  const orc = box(parent, { width: '380px', height: '118px', borderRadius: '14px', background: '#fff', boxShadow: '0 24px 60px rgba(2,8,30,.35)', transformOrigin: '0 0', fontFamily: 'var(--display)' },
    `<div style="position:absolute;left:22px;top:20px;font:500 16px/1 var(--display);color:#111827">Orçamentos</div>`);
  const o1 = box(orc, { left: '22px', top: '50px', font: '500 26px/1 var(--display)', color: LINK });
  box(orc, { left: '22px', top: '84px', font: '400 14px/1 var(--display)', color: '#374151' }, 'Optados');
  const o2 = box(orc, { left: '170px', top: '50px', font: '500 26px/1 var(--display)', color: '#d0314f' });
  box(orc, { left: '170px', top: '84px', font: '400 14px/1 var(--display)', color: '#374151' }, 'Não optados');
  const pie = svgEl(`<svg class="abs" width="84" height="84" viewBox="-42 -42 84 84" style="left:280px;top:17px"><circle r="40" fill="#e9eef6"/><circle class="pa" r="20" fill="none" stroke="#5b9be6" stroke-width="40" pathLength="1" stroke-dasharray="1" transform="rotate(-90)"/><circle class="pb" r="20" fill="none" stroke="#e5566f" stroke-width="40" pathLength="1" stroke-dasharray="0 1" transform="rotate(-90)"/></svg>`, orc);
  const pa = pie.querySelector('.pa'), pb = pie.querySelector('.pb');
  const att = box(parent, { width: '380px', height: '118px', borderRadius: '14px', background: '#fff', boxShadow: '0 24px 60px rgba(2,8,30,.35)', transformOrigin: '0 0', fontFamily: 'var(--display)' },
    `<div style="position:absolute;left:22px;top:20px;font:500 16px/1 var(--display);color:#111827">Atendimentos</div>
     <div style="position:absolute;right:16px;top:26px;font:600 11.5px/1 var(--display);color:#1f6fd6;background:#e3f0fd;padding:4px 7px;border-radius:4px">249 Realizados</div>
     <div style="position:absolute;right:16px;top:52px;font:600 11.5px/1 var(--display);color:#b4233c;background:#fde3e7;padding:4px 7px;border-radius:4px">10 Não realizados</div>
     <div style="position:absolute;left:22px;top:84px;font:400 14px/1 var(--display);color:#374151">Agendamentos</div>`);
  const a1 = box(att, { left: '22px', top: '50px', font: '500 26px/1 var(--display)', color: LINK });

  const hiAt = []; // [time, card index] — set by the caller: the module lit by the narration
  const out = {
    el: root, w: W, h: H, cards, menu, orc, att, hiAt,
    /** Where a design point (x, y) of the dashboard lands, given the transform the caller wrote. */
    frame(t, ft, { x = 0, y = 0, s = 1, rx = 0, o = 1 } = {}) {
      set(root, { x, y, s, rx, o, origin: '0 0' });
      const d = t - at;
      menu.forEach((m, i) => {
        const p = snapIn(t, at + 0.25 + i * 0.05, 0.4);
        const lit = (i === 2 && hiOn(t, 0)) || (i === 4 && hiOn(t, 1)) || (i === 6 && hiOn(t, 2)) || (i === 5 && hiOn(t, 9)); // 9 = the CRC (no module card)
        m.style.background = lit ? '#e3effc' : 'transparent';
        m.style.color = lit ? LINK : '#374151';
        set(m, { x: (1 - p) * -60, o: p });
      });
      hello.textContent = typed('Olá  Kauan Soares, Seja Bem Vindo(a)', ft, at + 0.4, 40);
      set(today, { o: fade(t, at + 1.2, 0.3) });
      set(quote, { o: fade(t, at + 1.4, 0.4), x: (1 - snapIn(t, at + 1.4)) * 30 });
      set(greet, { o: fade(t, at + 0.15), y: (1 - snapIn(t, at + 0.15)) * -20 });
      cards.forEach((c, i) => {
        const p = pop(t, at + 0.55 + i * 0.1, 0.45);
        const lit = hiOn(t, i);
        const lp = lit ? ease.outBack(clamp((t - hiStart(t, i)) / 0.3)) : 0;
        c.c.style.boxShadow = lit ? `0 0 0 3px ${BLUE}, 0 24px 50px rgba(47,127,221,.35)` : '0 2px 10px rgba(15,30,60,.06)';
        c.btn.style.background = lit ? LINK : 'transparent';
        c.btn.style.color = lit ? '#fff' : LINK;
        set(c.c, { y: (1 - p) * 80 - lp * 14, s: (0.85 + 0.15 * p) * (1 + 0.05 * lp), o: clamp(p * 2) });
      });
      statEls.forEach((st, i) => {
        const t0 = at + 0.9 + i * 0.12;
        st.v.textContent = `${count(ft, t0, 1.1, st.n)} ${st.unit}`;
        set(st.c, { o: fade(t, t0 - 0.1, 0.2), y: (1 - snapIn(t, t0 - 0.1)) * 30 });
      });
      set(chart, { o: fade(t, at + 1.1, 0.25), y: (1 - snapIn(t, at + 1.1)) * 40 });
      bars.forEach(({ bb, i, k }) => set(bb, { sy: Math.max(0.001, ease.outBack(clamp((t - (at + 1.35 + i * 0.07 + k * 0.04)) / 0.5))) }));
      return d;
    },
    /** The floating cards, placed by the caller in the parent's coordinates. */
    floats(t, ft, { ox, oy, ax, ay, t1, t2, s = 1 }) {
      const p1 = snapIn(t, t1, 0.55), p2 = snapIn(t, t2, 0.55);
      set(orc, { x: ox + (1 - p1) * 500, y: oy, s, r: (1 - p1) * 8, o: clamp(p1 * 3) });
      set(att, { x: ax + (1 - p2) * 500, y: ay, s, r: (1 - p2) * 8, o: clamp(p2 * 3) });
      o1.textContent = String(count(ft, t1 + 0.1, 0.9, 206));
      o2.textContent = String(count(ft, t1 + 0.1, 0.9, 19));
      a1.textContent = String(count(ft, t2 + 0.1, 0.9, 259));
      const pp = ease.inOutCubic(clamp((t - t1 - 0.15) / 0.8));
      const share = 19 / 225;
      pb.setAttribute('stroke-dasharray', `${(share * pp).toFixed(4)} 1`);
      pa.setAttribute('stroke-dashoffset', '0');
      pa.setAttribute('stroke-dasharray', `${pp.toFixed(4)} 1`);
    },
  };
  function hiStart(t, i) { let s = -1; for (const [a, k] of hiAt) if (k === i && t >= a) s = a; return s; }
  function hiOn(t, i) {
    // a module is lit from its word until the next one lights (or 1.4 s)
    let cur = -1, start = -1;
    for (const [a, k] of hiAt) if (t >= a && a >= start) { cur = k; start = a; }
    return cur === i && t - start < 1.4;
  }
  return out;
}

// ---- the agents screen (brand/img/01-…png): the list, and the "Nova regra de Orcamento" modal ---------------------
export function agentsScreen(parent, { at, open, typeAt, addAt, lit = [] }) {
  const W = 980;
  const root = box(parent, { width: `${W}px`, height: '880px', borderRadius: '22px', background: '#fff', boxShadow: '0 40px 120px rgba(2,8,30,.55)', overflow: 'hidden', transformOrigin: '0 0', fontFamily: 'var(--display)' });
  box(root, { left: '36px', top: '30px', font: '500 46px/1 var(--display)', color: '#374151' }, 'Agentes');
  box(root, { left: 0, top: '104px', width: `${W}px`, height: '776px', background: '#eef2f8' });
  const names = ['Tratamento de Recorrência', 'Recuperação de Faltosos', 'Recuperação de Orçamento', 'Lembrete/Confirmação'];
  const rows = names.map((n, i) => {
    const r = box(root, { left: '34px', top: `${136 + i * 182}px`, width: `${W - 68}px`, height: '156px', borderRadius: '14px', background: '#fff', boxShadow: '0 6px 18px rgba(15,30,60,.07)' },
      `<div style="position:absolute;left:40px;top:58px;font:500 42px/1 var(--display);color:#4b5563">${n}</div><div style="position:absolute;right:34px;top:56px">${chevron(42)}</div>`);
    const badge = box(r, { right: '96px', left: 'auto', top: '52px', padding: '10px 18px', borderRadius: '30px', background: '#e8f9ee', color: '#16a34a', font: '700 24px/1 var(--display)', display: 'flex', gap: '10px', alignItems: 'center' },
      `<svg width="26" height="26" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#3ccf6a"/><path d="M14 25l7 7 13-15" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>Ativo`);
    return { r, badge };
  });
  // the modal, exactly as on the site
  const M = box(parent, { width: '880px', height: '700px', borderRadius: '14px', background: '#fff', boxShadow: '0 40px 100px rgba(2,8,30,.5)', transformOrigin: '50% 50%', fontFamily: 'var(--display)', color: '#374151' });
  box(M, { left: 0, top: 0, width: '880px', height: '82px', background: '#f6f8fb', borderRadius: '14px 14px 0 0' });
  box(M, { left: '30px', top: '28px', font: '500 30px/1 var(--display)', color: '#1f2937' }, 'Nova regra de Orcamento');
  box(M, { right: '28px', left: 'auto', top: '22px', font: '400 34px/1 var(--display)', color: '#9aa3af' }, '×');
  const lab = (x, y, s) => box(M, { left: `${x}px`, top: `${y}px`, font: '500 19px/1 var(--display)', color: '#4b5563' }, s);
  const field = (x, y, w, txt, dd) => { const f = box(M, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: '50px', border: '1.5px solid #d6dbe3', borderRadius: '6px', boxSizing: 'border-box', padding: '0 16px', display: 'flex', alignItems: 'center', font: '400 21px/1 var(--display)', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden' }, `<span>${txt}</span>${dd ? `<span style="margin-left:auto">${down(18)}</span>` : ''}`); return f; };
  lab(30, 110, 'Canal'); field(30, 140, 390, 'Aplicativo do paciente', true);
  lab(460, 110, 'Notificação *'); const notif = field(460, 140, 390, '', true);
  lab(30, 214, 'Título'); const title = field(30, 244, 820, '');
  lab(30, 318, 'Corpo'); const body = box(M, { left: '30px', top: '348px', width: '820px', height: '104px', border: '1.5px solid #d6dbe3', borderRadius: '6px', boxSizing: 'border-box', padding: '14px 16px', font: '400 21px/1.45 var(--display)', color: '#374151', whiteSpace: 'pre-wrap' });
  lab(30, 478, 'Regra *'); field(30, 508, 250, 'Dia da semana', true);
  lab(310, 478, 'Dia da semana *'); field(310, 508, 250, 'Segunda-feira', true);
  lab(590, 478, 'Horário (em horas) *'); field(590, 508, 260, '12');
  box(M, { left: '760px', top: '509px', width: '89px', height: '48px', background: '#eef1f5', font: '400 19px/48px var(--display)', textAlign: 'center', color: '#4b5563', borderRadius: '0 6px 6px 0' }, 'horas');
  const add = box(M, { right: '30px', left: 'auto', top: '610px', padding: '14px 28px', borderRadius: '6px', background: BLUE, color: '#fff', font: '500 22px/1 var(--display)' }, 'Adicionar');
  const dd = box(M, { left: '460px', top: '192px', width: '390px', borderRadius: '6px', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,.15)', overflow: 'hidden', font: '400 19px/1 var(--display)' },
    `<div style="padding:12px 16px;color:#b6bcc6">Selecione qual notificação será enviada</div><div class="pick" style="padding:12px 16px;color:#fff;background:#1f6fd6">Recuperação de Orçamento não optado</div>`);
  const notifTxt = 'Recuperação de Orçamento não op…';
  const titleTxt = 'Olá, Beatriz Alcantara !';
  const bodyTxt = 'Seu orçamento para Clareamento à laser ganhou um desconto especial!\nDe R$ 400 por R$ 299';
  const cur = cursor(parent, 44);
  return {
    el: root, modal: M, w: W, h: 880, mw: 880, mh: 700,
    frame(t, ft, { x, y, s = 1, mx, my, ms = 1 }) {
      const p = snapIn(t, at, 0.6);
      set(root, { x, y: y + (1 - p) * 300, s, rx: (1 - p) * 30, o: clamp(p * 3), origin: '0 0' });
      rows.forEach((r, i) => {
        const rp = snapIn(t, at + 0.25 + i * 0.09, 0.45);
        set(r.r, { x: (1 - rp) * 200, o: rp });
        const k = lit.findIndex(([, idx]) => idx === i);
        const bp = k < 0 ? 0 : pop(t, lit[k][0], 0.35);
        set(r.badge, { s: Math.max(0.001, bp), o: clamp(bp * 3) });
        r.r.style.boxShadow = k >= 0 && t >= lit[k][0] ? '0 0 0 3px #3ccf6a, 0 10px 26px rgba(60,207,106,.25)' : '0 6px 18px rgba(15,30,60,.07)';
      });
      // the modal opens, the notification is picked from its list, the title and the body type, Adicionar is clicked
      const mp = ease.outBack(clamp((t - open) / 0.45));
      const closeP = ease.inCubic(clamp((t - addAt - 0.35) / 0.3));
      const k = (0.7 + 0.3 * mp) * (1 - 0.1 * closeP); // the pop scales about the modal's centre; the cursor keys stay in the settled frame
      set(M, { x: mx + (1 - k) * 440 * ms, y: my + (1 - k) * 350 * ms + closeP * 120, s: ms * k, o: clamp(mp * 3) * (1 - closeP), origin: '0 0' });
      const ddOn = t > open + 0.35 && t < open + 0.95;
      set(dd, { o: ddOn ? 1 : 0, sy: ddOn ? ease.outCubic(clamp((t - open - 0.35) / 0.15)) : 1, origin: '50% 0' });
      dd.querySelector('.pick').style.background = t > open + 0.7 ? '#1f6fd6' : '#fff';
      dd.querySelector('.pick').style.color = t > open + 0.7 ? '#fff' : '#374151';
      notif.querySelector('span').textContent = t > open + 0.9 ? notifTxt : '';
      title.querySelector('span').textContent = typed(titleTxt, ft, typeAt, 42);
      const bStart = typeAt + titleTxt.length / 42 + 0.1;
      body.textContent = typed(bodyTxt, ft, bStart, 92);
      const clicked = t >= addAt && t < addAt + 0.25;
      add.style.background = clicked ? '#1b5fb8' : BLUE;
      set(add, { s: clicked ? 0.94 : 1 });
      // the cursor: to the Notificação field, down to the option, to Título, then to Adicionar
      const keys = [[open + 0.1, [mx + 700 * ms, my + 900 * ms]], [open + 0.3, [mx + 640 * ms, my + 165 * ms]], [open + 0.6, [mx + 640 * ms, my + 255 * ms]], [typeAt - 0.1, [mx + 300 * ms, my + 270 * ms]], [addAt - 0.3, [mx + 300 * ms, my + 300 * ms]], [addAt - 0.02, [mx + 800 * ms, my + 635 * ms]]];
      let pos = keys[0][1];
      for (let i = 1; i < keys.length; i++) if (t > keys[i - 1][0]) pos = [lerp(keys[i - 1][1][0], keys[i][1][0], ease.inOutCubic(clamp((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])))), lerp(keys[i - 1][1][1], keys[i][1][1], ease.inOutCubic(clamp((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]))))];
      const cOn = t > open + 0.1 && t < addAt + 0.4;
      set(cur.c, { x: pos[0], y: pos[1], o: cOn ? 1 : 0, s: (t > open + 0.6 && t < open + 0.7) || clicked ? 0.85 : 1 });
      const clickT = [open + 0.3, open + 0.6, addAt].filter((c) => t >= c && t < c + 0.4);
      const cp = clickT.length ? (t - clickT[clickT.length - 1]) / 0.4 : 1;
      set(cur.ring, { x: pos[0] - cur.s * 0.55, y: pos[1] - cur.s * 0.55, s: 0.4 + cp, o: cOn && cp < 1 ? 1 - cp : 0 });
    },
  };
}

// ---- a notification (brand/img/08-image.png), rebuilt -------------------------------------------------------------
export function notification(parent, { title, text, time, bell = false }, w = 900) {
  const n = box(parent, { width: `${w}px`, borderRadius: '30px', background: 'rgba(255,255,255,.97)', boxShadow: '0 20px 50px rgba(2,8,30,.35)', padding: '26px 30px 26px 132px', boxSizing: 'border-box', fontFamily: '-apple-system, "Segoe UI", var(--display)', color: '#111' },
    `<div style="position:absolute;left:28px;top:50%;margin-top:-40px;width:80px;height:80px;border-radius:20px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.12);display:grid;place-items:center">
       <svg width="50" height="40" viewBox="0 0 50 40"><path d="M2 2h9l13 18-13 18H2l13-18z" fill="#3b4fe0"/><path d="M17 2h9l13 18-13 18h-9l13-18z" fill="#3b4fe0"/><path d="M32 2h12L32 20z" fill="#2d6df0"/></svg></div>
     <div style="display:flex;justify-content:space-between;font:700 30px/1.2 var(--display)"><span>${title}</span><span style="font:400 26px/1.2 var(--display);color:#666">${time}</span></div>
     <div style="font:400 28px/1.3 var(--display);margin-top:6px;color:#222">${text}</div>`);
  return n;
}

// ---- the patient's app (brand/img/05-…png), on a phone drawn in CSS -------------------------------------------------
export function patientPhone(parent, { at }) {
  const W = 620, H = 1260;
  const ph = box(parent, { width: `${W}px`, height: `${H}px`, borderRadius: '92px', background: '#1a1c22', boxShadow: '0 50px 120px rgba(2,8,30,.6), inset 0 0 0 4px #4a4d55', transformOrigin: '0 0', fontFamily: 'var(--display)' });
  const scr = box(ph, { left: '22px', top: '22px', width: `${W - 44}px`, height: `${H - 44}px`, borderRadius: '72px', background: '#fff', overflow: 'hidden' });
  const head = box(scr, { left: 0, top: 0, width: '100%', height: '560px', background: '#2f7fdd' });
  box(scr, { left: '50%', top: '18px', width: '190px', height: '54px', marginLeft: '-95px', borderRadius: '30px', background: '#000' });
  box(scr, { left: '54px', top: '30px', font: '600 28px/1 var(--display)', color: '#fff' }, '16:47');
  box(scr, { right: '46px', left: 'auto', top: '28px', font: '700 22px/1 var(--display)', color: '#000', background: '#f5d742', padding: '3px 8px', borderRadius: '8px' }, '65');
  const avatar = box(scr, { right: '40px', left: 'auto', top: '120px', width: '80px', height: '80px', borderRadius: '50%', background: '#e8f0fb', display: 'grid', placeItems: 'center' },
    `<svg width="56" height="56" viewBox="0 0 48 48" fill="#9db7d9"><circle cx="24" cy="17" r="10"/><path d="M5 46c0-12 8-18 19-18s19 6 19 18z"/></svg>`);
  const hi = box(scr, { left: '40px', top: '196px', font: '500 44px/1.15 var(--display)', color: '#fff', whiteSpace: 'pre' });
  const sub = box(scr, { left: '40px', top: '304px', font: '400 25px/1 var(--display)', color: '#e8f1fd', whiteSpace: 'nowrap' }, 'Seja bem vindo(a) à Clínica Infinity Dental');
  const banner = box(scr, { left: '36px', top: '370px', width: `${W - 116}px`, height: '290px', borderRadius: '22px', background: 'linear-gradient(135deg,#2a63c9,#3c8ef0)', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,.2)' },
    `<div style="position:absolute;left:0;right:0;top:26px;text-align:center;font:500 30px/1.2 var(--display);color:#fff">Aproveite estes <b>cupons*</b><br>antes que <b>expirem!</b></div>`);
  const coupons = [['10%', 'boasvindas10'], ['R$ 5', 'manutenção'], ['15%', 'facetas15']].map(([v, c], i) => box(banner, { left: `${70 + i * 40}px`, top: `${126 + i * 50}px`, width: '300px', height: '42px', borderRadius: '8px', background: i === 1 ? '#3d6fd8' : '#5fdc8b', border: '2px solid #fff', font: '700 19px/38px var(--display)', color: '#0b2a63', padding: '0 12px', boxSizing: 'border-box' }, `${v} OFF · Código: ${c}`));
  const btns = [['Consultas', 'users'], ['Cupons', 'archive'], ['Pagamentos', 'money'], ['Configur…', 'cal']].map(([n, ic], i) => {
    const b = box(scr, { left: `${28 + i * 140}px`, top: '700px', width: '126px', textAlign: 'center', font: '500 22px/1 var(--display)', color: '#111' },
      `<div style="width:112px;height:112px;margin:0 auto 14px;border-radius:50%;background:#eef1f5;display:grid;place-items:center">${solid(ic, 48)}</div>${n}`);
    return b;
  });
  const list = ['Termos', 'Anamneses', 'Agendar consulta'].map((n, i) => box(scr, { left: '36px', top: `${900 + i * 118}px`, width: `${W - 116}px`, height: '100px', borderRadius: '16px', background: '#f1f3f6', display: 'flex', alignItems: 'center', gap: '26px', padding: '0 28px', boxSizing: 'border-box', font: '500 34px/1 var(--display)', color: '#222' },
    `${solid(['archive', 'users', 'cal'][i], 44)}<span>${n}</span><span style="margin-left:auto">${chevron(30, '#555')}</span>`));
  return {
    el: ph, w: W, h: H, screen: scr,
    frame(t, ft, { x, y, s = 1, rx = 0, o = 1 }) {
      set(ph, { x, y, s, rx, o, origin: '0 0' });
      set(head, { sy: Math.max(0.001, snapIn(t, at, 0.5)), origin: '50% 0' });
      hi.textContent = typed('Olá\nThaina Lucas', ft, at + 0.3, 26);
      set(sub, { o: fade(t, at + 0.75, 0.3) });
      set(avatar, { s: Math.max(0.001, pop(t, at + 0.25)) });
      const bp = snapIn(t, at + 0.55, 0.5);
      set(banner, { y: (1 - bp) * 80, o: bp });
      coupons.forEach((c, i) => { const cp = snapIn(t, at + 0.75 + i * 0.1, 0.4); set(c, { x: (1 - cp) * -360, o: cp, r: -4 }); });
      btns.forEach((b, i) => set(b, { s: Math.max(0.001, pop(t, at + 0.85 + i * 0.07)), o: 1 }));
      list.forEach((l, i) => { const lp = snapIn(t, at + 1.05 + i * 0.08, 0.4); set(l, { x: (1 - lp) * 200, o: lp }); });
    },
  };
}

// ---- CRC Vendas (brand/img/09-image.png) — design size 1720 × 840 --------------------------------------------------
export function crcBoard(parent, { at }) {
  const W = 1720, H = 860;
  const root = box(parent, { width: `${W}px`, height: `${H}px`, borderRadius: '20px', background: '#eef2f8', boxShadow: '0 40px 120px rgba(2,8,30,.55)', overflow: 'hidden', transformOrigin: '0 0', fontFamily: 'var(--display)', color: '#2b2f38' });
  const hd = box(root, { left: '6px', top: '6px', width: `${W - 12}px`, height: '84px', borderRadius: '14px', background: '#fff' },
    `<div style="position:absolute;left:24px;top:28px;font:500 30px/1 var(--display);color:#333">CRC Vendas</div>`);
  const filt = box(hd, { right: '28px', left: 'auto', top: '22px', padding: '9px 18px', border: '2px solid #2f7fdd', borderRadius: '6px', color: '#2f7fdd', font: '500 22px/1 var(--display)' }, `<svg width="18" height="18" viewBox="0 0 20 20" style="vertical-align:-2px;margin-right:8px"><path d="M2 3h16l-6 7v6l-4 2v-8z" fill="#2f7fdd"/></svg>Filtrar`);
  const cols = [
    ['Não optado (10)', 'R$ 2.960,00', 2960, [['Há 89 dias', 'red', 'DANIEL DUARTE DE MOURA - R$ 400,00', 'Dr. Paulo Henrique', '03/07/2025'], ['Há 89 dias', 'red', 'HELDER FERREIRA COUTINHO - R$ 100,00', 'Dr. Paulo Henrique', '03/07/2025']]],
    ['Não optado (ortodontia) (2)', 'R$ 1.175,00', 1175, [['Há 12 dias', 'red', 'Vicente Gael dos Santos - R$ 500,00', 'Dr. Paulo Henrique', '18/09/2025', 1], ['Há 40 dias', 'red', 'Talita Pereira - R$ 675,00', 'Dr. Paulo Henrique', '', 1]]],
    ['Em negociação (4)', 'R$ 680,00', 680, [['Há 15 dias', 'orange', 'Adriano Nogueira - R$ 250,00', 'Dr. Paulo Henrique', '15/09/2025'], ['Há 40 dias', 'orange', 'Anderson Moraes - R$ 250,00', 'Dr. Paulo Henrique', '21/08/2025'], ['Há 56 dias', 'orange', 'Otávio Mendes - R$ 80,00', 'Dr. Paulo Henrique', '05/08/2025']]],
    ['Aguardando pagamento (3)', 'R$ 795,00', 795, [['Há 8 dias', 'blue', 'Anderson Moraes - R$ 700,00', 'Dr. Paulo Henrique', '22/09/2025'], ['Há 12 dias', 'blue', 'Tatiane Yasmin Gomes - R$ 15,00', 'Dr. Paulo Henrique', '']]],
  ];
  const TAG = { red: ['#fde3e7', '#c8243f'], orange: ['#fde9dc', '#c45a16'], blue: ['#e1ecfc', '#1f6fd6'] };
  const cw = (W - 12 - 3 * 12) / 4;
  const colEls = cols.map(([name, total, v, cards], i) => {
    const c = box(root, { left: `${6 + i * (cw + 12)}px`, top: '104px', width: `${cw}px`, height: `${H - 110}px`, borderRadius: '12px 12px 0 0', background: '#f6f8fc' });
    box(c, { left: 0, top: 0, width: `${cw}px`, height: '74px', background: '#fff', borderRadius: '12px 12px 0 0' });
    box(c, { left: '16px', top: '18px', width: `${cw - 150}px`, font: '500 22px/1.1 var(--display)', color: '#333' }, name);
    const tot = box(c, { right: '14px', left: 'auto', top: '18px', font: '500 22px/1.1 var(--display)', color: '#333', whiteSpace: 'nowrap' });
    const cs = cards.map(([tag, kind, line, dr, date, orto], k) => {
      const e = box(c, { left: '14px', top: `${92 + k * 196}px`, width: `${cw - 28}px`, height: '178px', borderRadius: '10px', background: '#fff', boxShadow: '0 4px 14px rgba(15,30,60,.08)' },
        `<span style="position:absolute;left:18px;top:16px;padding:5px 10px;border-radius:5px;background:${TAG[kind][0]};color:${TAG[kind][1]};font:600 17px/1 var(--display)">${tag}</span>
         ${orto ? '<span style="position:absolute;right:16px;top:16px;padding:5px 10px;border-radius:5px;background:#dff3fb;color:#1789b5;font:600 17px/1 var(--display)">Ortodontia</span>' : ''}
         <div style="position:absolute;left:18px;top:58px;right:10px;font:500 17px/1.2 var(--display);color:#2b2f38;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${line}</div>
         <div style="position:absolute;left:18px;top:90px;font:400 16px/1 var(--display);color:#9aa1ad">${dr}</div>
         <div style="position:absolute;left:18px;right:18px;top:122px;height:1px;background:#eceff3"></div>
         <div style="position:absolute;left:18px;top:140px;font:400 16px/1 var(--display);color:#9aa1ad">${date}</div>
         <div style="position:absolute;right:16px;top:134px">${chevron(24, '#444')}</div>`);
      return e;
    });
    return { c, tot, v, cs };
  });
  const brl = (n) => `R$ ${Math.round(n).toLocaleString('pt-BR')},00`;
  return {
    el: root, w: W, h: H, cols: colEls,
    frame(t, ft, { x, y, s = 1, rx = 0, ry = 0, o = 1 }) {
      set(root, { x, y, s, rx, ry, o, origin: '0 0' });
      set(hd, { y: (1 - snapIn(t, at)) * -60, o: fade(t, at) });
      const fp = pop(t, at + 0.4);
      set(filt, { s: Math.max(0.001, fp) });
      colEls.forEach((col, i) => {
        const t0 = at + 0.2 + i * 0.12;
        const cp = snapIn(t, t0, 0.5);
        set(col.c, { y: (1 - cp) * 300, o: clamp(cp * 2) });
        col.tot.textContent = brl(count(ft, t0 + 0.2, 1.0, col.v));
        col.cs.forEach((e, k) => { const p = pop(t, t0 + 0.35 + k * 0.12, 0.4); set(e, { y: (1 - p) * 80, s: 0.9 + 0.1 * p, o: clamp(p * 3) }); });
      });
    },
  };
}
