// The Clinicx score — written for this video from its sound brief (README.md):
// driving breakbeat, 124 BPM. Act 1 (the problem) in F♯ minor, the drums low-passed and gritty, a dark pad, a hit per
// slam, a glitch per no-show, a pop per unanswered message; the cash line falls into a hole of silence. The question
// brings a thin pulse back; a riser and a reverse cymbal run into the drop, where the key turns to A major (the
// relative major: the same notes, now bright) and the full break opens. The sonic logo is a rising A – C♯ – E on glass
// bells: the » moving forward. Brand world: phone notification chimes, message pops, a till ding, a clock tick.
//
//   node audio/score.mjs                 music only → out/music.wav
//   node audio/score.mjs --vo            the dubbed cut: the narration on its own bus, the music riding ~10 dB under
//                                        every line → out/music-vo.wav
//   (--report prints the per-bus level per scene)
import * as A from './synth/index.mjs';
import { BPM, BEAT, DURATION, CUE, S, b, VO_AT, END, LINE, WORDAT } from '../js/timeline.mjs';
import { COPY, DEFAULT_LANG } from '../js/copy.mjs';
import { VO_WORDS } from '../js/vo.data.mjs';

const args = process.argv.slice(2);
const VO = args.includes('--vo');
const TX = COPY[DEFAULT_LANG];
const out = args.find((a) => a.endsWith('.wav')) || (VO ? 'out/music-vo.wav' : 'out/music.wav');

A.init({ duration: DURATION, bpm: BPM, seed: 34913 });
// a clean, roomy mix: no drive or bit-crush on the drums, the top rolled off, pads and leads in a wide space, the
// hits and effects well under the music (the person: "muito estourado… mais ambientizado")
A.bus('drums', { gain: -7, lp: 9000, verb: 0.1, eq: [{ f: 3500, g: -2, q: 0.8, type: 'peak' }] });
A.bus('bass', { gain: -7, duck: 0.35, lp: 2500 });
A.bus('music', { gain: 0, duck: 0.25, verb: 0.38, width: 1.4 });
A.bus('lead', { gain: -10, verb: 0.4, delay: 0.25, lp: 7000 });
A.bus('fx', { gain: -12, verb: 0.3, lp: 9000 });
// the narration's own chain: low cut, less mud, more presence and air, a firmer compressor — a voice that sits in front
if (VO) A.bus('vo', { gain: 12, hp: 90, duck: 0, verb: 0.02,
  eq: [{ f: 250, g: -2.5, q: 1, type: 'peak' }, { f: 3200, g: 1.5, q: 0.8, type: 'peak' }, { f: 7000, g: -1.5, q: 1.2, type: 'peak' }],
  comp: { threshold: -20, ratio: 2.2, attack: 0.008, release: 0.15, makeup: 2 } });


// every hit a lot gentler than the synth's default (impacts, booms, crashes, glitches)
const soft = (f, k) => (t, ...r) => { const o = r[r.length - 1]; if (o && typeof o === 'object' && !Array.isArray(o)) r[r.length - 1] = { ...o, vel: (o.vel ?? 1) * k }; return f(t, ...r); };
const impact = soft(A.impact, 0.45), boom = soft(A.boom, 0.4), crash = soft(A.crash, 0.45), glitch = soft(A.glitch, 0.5);
const errorBuzz = soft(A.errorBuzz, 0.4), thud = soft(A.thud, 0.6), whoosh = soft(A.whoosh, 0.65), riser = soft(A.riser, 0.6), downlifter = soft(A.downlifter, 0.6);
const bt = (t) => t / BEAT; // seconds → beats
const DROPB = bt(CUE.drop);

// ---- harmony: one table, both keys ---------------------------------------------------------------------------------
// act 1: F♯m – D – A – E (a bar each); the question: D – E – (hold) ; from the drop: A – E – F♯m7 – Dmaj7, then the
// plans (the payoff, drop 2) lift to D – E – A – A
const prog = [];
for (let k = 0; k < 32; k += 4) prog.push([k, ['F#m', 'D', 'A', 'E'][(k / 4) % 4]]);
prog.push([32, 'F#m'], [bt(CUE.turn), 'Dmaj7'], [bt(CUE.turn) + 4, 'E'], [bt(CUE.turn) + 8, 'Esus4']);
for (let k = DROPB, i = 0; k < bt(DURATION) + 4; k += 4, i++) {
  const payoff = k >= bt(S.plans[0]) - 0.01 && k < bt(S.lockup[0]);
  prog.push([k, payoff ? ['D', 'E', 'A', 'A'][i % 4] : ['A', 'E', 'F#m7', 'Dmaj7'][i % 4]]);
}
const H = A.harmony(prog, { oct: 4 });
const chordAt = (t) => H.at(bt(t));
const scA = A.scale('A', 'major');
const scF = A.scale('F#', 'minor');

// ---- drums ---------------------------------------------------------------------------------------------------------
/** The break between t0 and t1; full: the open break with ghost snares and an open hat; ride: drop 2's extra layer. */
function brk(t0, t1, { full = true, ride = false, vel = 1 } = {}) {
  if (t1 <= t0) return;
  // a two-bar break: the second bar moves a kick and flams the last snare
  for (const h of A.steps('X.........X.x...X.....X...X.x...', { from: t0, to: t1 })) A.kick(h.t, { type: 'soft', tune: 'A1', vel: 0.9 * h.vel * vel });
  for (const h of A.steps(full ? '....X..o.o..X..o....X..o.o..X.oX' : '....X.......X.......X.......X...', { from: t0, to: t1 })) A.snare(h.t, { type: 'tight', vel: (h.vel === 1 ? 0.6 : 0.22) * vel });
  for (const h of A.steps(full ? 'x.x.x.x.x.x.x.xX' : 'x...x...x...x...', { from: t0, to: t1, swing: 0.06 })) A.hat(h.t, { open: h.vel === 1 && full, decay: h.vel === 1 ? 0.18 : 0.05, vel: (h.vel === 1 ? 0.4 : 0.26) * vel, pan: 0.18, tone: 0.9 });
  for (const h of A.steps('.x.x.x.x.x.x.x.x', { from: t0, to: t1 })) A.shaker(h.t, { vel: 0.18 * vel, pan: -0.3 });
  if (ride) for (const h of A.steps('x.x.x.x.x.x.x.x.', { from: t0, to: t1 })) A.ride(h.t, { vel: 0.22 * vel, pan: 0.35 });
}
/** The bass: a syncopated root line, round acid (low resonance) — one bassLine call per stretch. */
function bassRun(t0, t1, { vel = 1, cut = 700 } = {}) {
  const list = [];
  for (const h of A.steps('X..x..X...x.x...', { from: t0, to: t1 })) {
    const root = chordAt(h.t + 0.01).root;
    list.push({ t: h.t, dur: b(h.vel === 1 ? 1.2 : 0.45), note: root - 12 + (h.i % 16 === 12 ? 12 : 0), vel: (h.vel === 1 ? 0.9 : 0.7) * vel });
  }
  if (list.length) A.bassLine(list, { drive: 1.6, cut, glide: 0.04 });
}
/** Off-beat stabs following the harmony (warm, short). */
function stabs(t0, t1, vel = 0.42) {
  for (const h of A.steps('..x...x...x..x..', { from: t0, to: t1 })) A.stab(h.t, chordAt(h.t + 0.01), { vel, dur: 0.11 });
}

// ---- ACT 1: the problem (F♯ minor, filtered, tense) ----------------------------------------------------------------
const P0 = 0, P1 = CUE.hole;
brk(P0, P1, { full: false, vel: 0.85 });
bassRun(P0, P1, { vel: 0.8, cut: 380 });
for (const [a, z, ch] of H.spans(0, bt(P1))) A.pad(b(a), b(z - a) + 0.2, A.voiceLead([ch])[0], { type: 'dark', attack: 0.4, release: 0.6, vel: 0.65 });
A.automate('drums', 'lp', [[0, 1400], [CUE.noshow, 2200], [CUE.broke, 3200], [CUE.hole - 0.05, 3200], [CUE.hole, 900], [CUE.turn - 0.4, 2600], [CUE.drop - 0.02, 5000], [CUE.drop, 20000]]);
A.automate('bass', 'lp', [[0, 900], [CUE.drop - 0.02, 900], [CUE.drop, 6000]]);
// a pulse that ticks like a leaking meter under the hook
for (const h of A.steps('x.x.x.x.x.x.x.x.', { from: 0, to: CUE.noshow })) A.tick(h.t, { bright: 2500, vel: 0.12, pan: 0.4 });
// the hook's slams and the drain
const slamHit = (t, v = 0.7, sub = 'F#1') => { impact(t, { vel: v, sub, air: 0.4, crack: 0.5 }); };
whoosh(WORDAT('hook', 'perdendo') - 0.25, 0.26, { shape: 'in', f0: 300, f1: 3500, vel: 0.35 });
slamHit(WORDAT('hook', 'perdendo'), 0.6);
slamHit(CUE.money, 0.8);
A.bass808(CUE.money, b(1.5), 'F#1', { drive: 2.2, vel: 0.6 });
downlifter(CUE.money + 0.05, 1.6, { vel: 0.3 });
A.swish(CUE.daily - 0.15, { pan: [0.9, -0.9], vel: 0.45 });
slamHit(CUE.daily, 0.55);
// the weekday chips turn red as they pass the centre: a muted tick for each
for (let i = 0; i < 9; i++) A.tick(CUE.daily + 0.05 + i * 0.35, { bright: 1800, vel: 0.25 });
// a glitch at every cut between the pains
for (const c of [CUE.noshow, CUE.budget, CUE.whats, CUE.broke]) { glitch(c - 0.03, 0.16, { vel: 0.55 }); impact(c, { vel: 0.4, sub: 'F#1', air: 0.2 }); }
// FALTOU: a stamp per failing slot (the same times as the picture)
{
  const a = WORDAT('chaos', 'falta'), z = WORDAT('chaos', 'avisa') + 0.3;
  for (let k = 0; k < 4; k++) { const t = A_lerp(a, z, k / 3); thud(t, { f0: 110, vel: 0.55 }); errorBuzz(t + 0.01, { vel: 0.18 }); }
}
function A_lerp(a, z, p) { return a + (z - a) * p; }
// the budget: paper in, the drawer swallows it
A.paper(CUE.budget + 0.02, { dur: 0.35, vel: 0.5 });
whoosh(WORDAT('chaos', 'gaveta'), CUE.whats - 0.35 - WORDAT('chaos', 'gaveta'), { shape: 'out', f0: 1800, f1: 300, pan: [0, 0], vel: 0.3 });
thud(CUE.whats - 0.36, { f0: 80, vel: 0.7 });
// the flood: a pop per bubble (falling, in F♯ minor), the same schedule as the picture (bubbleAt)
for (let i = 0; i < 14; i++) A.pop(CUE.whats + 0.1 + i * 0.16, scF.deg(7 - (i % 6), 5), { vel: 0.32 + 0.02 * (i % 3), pan: -0.4 + 0.06 * i });
// the fall
A.toneSweep(CUE.broke + 0.1, CUE.nofecha + 0.3 - CUE.broke, { from: 'F#4', to: 'F#2', wave: 'saw', cut: 1400, env: 'swell', vel: 0.18, bus: 'fx' });
slamHit(CUE.nofecha, 0.95);
boom(CUE.nofecha, { from: 70, to: 28, vel: 0.7 });
crash(CUE.nofecha, { vel: 0.3, dur: 1.6 });
// THE HOLE: everything stops until the question
A.tapeStop(CUE.hole - b(0.5), b(0.5), { until: CUE.turn - 0.4 });

// ---- ACT 2: the question (a thin pulse returns) → the drop --------------------------------------------------------
const Q0 = CUE.turn - 0.35;
whoosh(CUE.turn - 0.32, 0.65, { pan: [-0.9, 0.9], f0: 300, f1: 6500, vel: 0.6 });
impact(CUE.turn + 0.02, { vel: 0.45, sub: 'D1', air: 0.6 });
for (const [a, z, ch] of H.spans(bt(CUE.turn), DROPB)) A.pad(b(a), b(z - a) + 0.2, A.voiceLead([ch])[0], { type: 'glass', attack: 0.3, release: 0.5, vel: 0.6 });
// a kick + rim heartbeat under the question, then the clock ticks on 24H
for (const h of A.steps('X.......x.......', { from: CUE.turn, to: CUE.h24 })) A.kick(h.t, { type: 'soft', tune: 'D1', vel: 0.6 * h.vel });
for (const h of A.steps('....x.......x...', { from: CUE.turn, to: CUE.h24 })) A.rim(h.t, { vel: 0.35 });
impact(WORDAT('turn', 'trabalhasse'), { vel: 0.5, sub: 'D1', air: 0.4 });
impact(WORDAT('turn', 'por'), { vel: 0.55, sub: 'E1', air: 0.5 });
impact(CUE.h24, { vel: 0.75, sub: 'E1', air: 0.8 });
crash(CUE.h24, { vel: 0.25, dur: 1.4 });
for (const h of A.steps('x.x.x.x.x.x.x.x.', { from: CUE.h24, to: CUE.slice })) A.tick(h.t, { bright: 5200, vel: 0.22, pan: (h.i % 2 ? 0.3 : -0.3) }); // the clock
for (const h of A.steps('X...X...X...X...', { from: CUE.h24, to: CUE.drop - b(0.5) })) A.kick(h.t, { type: 'tight', tune: 'E1', vel: 0.55 });
A.roll(CUE.slice - b(2), CUE.drop - b(0.5), (t, v) => A.snare(t, { type: 'tight', vel: v * 0.5 }), { from: 1 / 4, to: 1 / 16 });
riser(CUE.h24, CUE.drop - 0.02, { vel: 0.55, curve: 2.4 });
A.reverseCymbal(CUE.drop, b(2), { vel: 0.55 });
whoosh(CUE.slice - 0.05, CUE.drop - CUE.slice + 0.05, { shape: 'in', pan: [-1, 0.2], f0: 200, f1: 8000, vel: 0.85 });
A.gap(CUE.drop - b(0.5), CUE.drop - 0.005, { buses: ['drums', 'bass', 'music', 'lead'] });

// ---- THE DROP: A major, the full break ----------------------------------------------------------------------------
impact(CUE.drop, { vel: 1, sub: 'A1', air: 1.2 });
boom(CUE.drop, { from: 95, to: 33, vel: 0.75 });
crash(CUE.drop, { vel: 0.55, dur: 2.6 });
/** The sonic logo: A – C♯ – E rising, glass bells doubled by a soft pluck. */
const sonicLogo = (t, v = 0.5) => ['A5', 'C#6', 'E6'].forEach((m, i) => {
  A.bell(t + i * b(0.5), m, { ratio: 3.01, index: 1.8, idec: 4, dur: 1.8, vel: v, bus: 'lead', verb: 0.4 });
  A.pluck(t + i * b(0.5), m, { type: 'fm', vel: v * 0.5, bus: 'lead' });
});
sonicLogo(CUE.drop + 0.02, 0.55);
A.sparkle(CUE.tag, { vel: 0.5 });

const G0 = CUE.drop, Gplans = S.plans[0], Gend = CUE.final - b(0.5);
brk(G0, Gplans, { full: true });
bassRun(G0, Gplans, { cut: 900 });
stabs(G0, Gplans);
for (const [a, z, ch] of H.spans(DROPB, bt(Gend))) A.pad(b(a), b(z - a) + 0.2, A.voiceLead([ch])[0], { type: 'warm', attack: 0.2, release: 0.5, vel: 0.5 });
// drop 2 — the payoff: the ride, a brighter bass, and a pluck arp the first drop didn't have
brk(Gplans, Gend, { full: true, ride: true, vel: 0.85 });
bassRun(Gplans, Gend, { cut: 1100, vel: 0.85 });
stabs(Gplans, Gend, 0.5);
for (const [a, z, ch] of H.spans(bt(Gplans), bt(Gend))) A.arp(b(a), b(z), ch.map((m) => m + 12), { rate: 1 / 4, pattern: 'up', bus: 'music', vel: VO ? 0.16 : 0.28, gate: 0.5, voice: (t, n, d, v) => A.pluck(t, n, { type: 'synth', dur: d, vel: v * 0.6, bus: 'music' }) });
// a fill and a crash at every scene change, each » slice gets its whoosh
for (const n of ['agents', 'flow', 'platform', 'plans', 'lockup']) {
  const t0 = S[n][0];
  whoosh(t0 - 0.02, b(1.1), { pan: [-0.9, 0.9], f0: 350, f1: 6000, vel: 0.5 });
  A.roll(t0 - b(1), t0, (t, v) => A.snare(t, { type: 'tight', vel: v * 0.35 }), { from: 1 / 8, to: 1 / 16 });
  crash(t0 + b(1.1), { vel: 0.22, dur: 1.4 });
}

// ---- the solution's SFX, from the same CUEs as the picture ----------------------------------------------------------
// agents: a success figure per check, a ding for "Tudo pelo WhatsApp"
[CUE.confirm, CUE.recover, CUE.bring].forEach((t, i) => { A.pop(t - 0.05, scA.deg(i * 2, 5), { vel: 0.45, pan: -0.3 + 0.3 * i }); A.tick(t + 0.1, { bright: 7000, vel: 0.2 }); });
A.success(CUE.viaWa, 'A5', { vel: 0.4 });
// the flow: the nodes light in a rising line, the last one resolves
[CUE.step1, CUE.step2, CUE.step3, CUE.step4].forEach((t, i) => { A.blip(t, ['A5', 'B5', 'C#6', 'E6'][i], { dur: 0.12, vel: 0.35 }); A.swish(t - 0.08, { pan: [i % 2 ? 0.6 : -0.6, 0], vel: 0.25 }); });
A.success(CUE.step4 + 0.25, 'A5', { vel: 0.45 });
whoosh(CUE.notify - b(1.5), b(1), { shape: 'out', pan: [0, 0], f0: 300, f1: 5000, vel: 0.45 });
/** The brand-world sound: the patient's phone — a soft two-note notification chime (E6 → A6), glassy. */
const chime = (t, v = 0.42) => { A.bell(t, 'E6', { ratio: 2, index: 1.2, idec: 6, dur: 0.6, vel: v, bus: 'fx', verb: 0.25 }); A.bell(t + 0.09, 'A6', { ratio: 2, index: 1.2, idec: 6, dur: 0.8, vel: v * 0.9, bus: 'fx', verb: 0.25 }); };
[CUE.n1, CUE.n2, CUE.n3, CUE.n4].forEach((t, i) => { chime(t + 0.03); A.paper(t, { dur: 0.15, vel: 0.2 }); });
// the platform: a slam per module tile, the gulp into the dashboard
[CUE.f1, CUE.f2, CUE.f3, CUE.f4].forEach((t, i) => { impact(t - 0.04, { vel: 0.35, sub: 'A1', air: 0.3 }); A.pop(t, scA.deg(4 + i, 4), { vel: 0.35 }); });
whoosh(CUE.allIn - 0.1, 0.45, { shape: 'in', pan: [0, 0], f0: 4000, f1: 300, vel: 0.5 });
impact(CUE.allIn + 0.35, { vel: 0.6, sub: 'A1', air: 0.7 });
// the CRC: the red words wiped green, the quote
whoosh(CUE.crc - b(0.75), b(1), { pan: [0.9, -0.6], f0: 300, f1: 5500, vel: 0.45 });
A.swish(WORDAT('crc', 'esquecidos') + 0.05, { pan: [-0.8, 0.8], vel: 0.5 });
A.success(WORDAT('crc', 'esquecidos') + 0.4, 'C#6', { vel: 0.35 });
impact(CUE.chosen, { vel: 0.55, sub: 'D1', air: 0.5 });
impact(WORDAT('crc', 'escolhido'), { vel: 0.7, sub: 'E1', air: 0.7 });
// the plans: ticks as the price rolls (kit.roll eases out-cubic over 0.6 s from price − 0.35), a till ding on landing
{
  const t0 = CUE.price - 0.35;
  let last = -1;
  for (let k = 0; k <= 60; k++) {
    const t = t0 + (0.6 * k) / 60;
    const v = Math.round(79 * (1 - Math.pow(1 - k / 60, 3)));
    if (v !== last && (k % 2 === 0 || v === 79)) A.tick(t, { bright: 4000 + v * 40, vel: 0.2 });
    last = v;
  }
  A.coin(CUE.price + 0.25, { vel: 0.5 });
  impact(CUE.price + 0.25, { vel: 0.6, sub: 'A1', air: 0.6 });
  for (let i = 0; i < 4; i++) A.pop(CUE.price + 0.7 + i * 0.16, scA.deg(i * 2, 5), { vel: 0.3, pan: i % 2 ? 0.4 : -0.4 });
  A.sparkle(CUE.free, { vel: 0.6 });
  A.success(CUE.free + 0.1, 'A5', { vel: 0.4 });
}
// the end card: the X slams, the button, the contacts, the last hit and the sonic logo
impact(CUE.cta - 0.05, { vel: 0.85, sub: 'A1', air: 1 });
sonicLogo(CUE.cta + 0.1, 0.45);
A.click(CUE.url - 0.05, { vel: 0.5 });
A.pop(CUE.url, 'E6', { vel: 0.4 });
TX.contacts.forEach((_, i) => A.pop(CUE.url + 1.0 + i * 0.3, ['C#6', 'E6'][i], { vel: 0.3, pan: -0.3 + 0.6 * i }));
A.gap(CUE.final - b(0.5), CUE.final - 0.005);
A.kick(CUE.final, { type: 'punch', tune: 'A1', vel: 1 });
impact(CUE.final, { vel: 0.9, sub: 'A1', air: 1 });
crash(CUE.final, { vel: 0.5, dur: 3 });
A.bass808(CUE.final, 2.2, 'A1', { drive: 2, vel: 0.7 });
A.pad(CUE.final, 3.5, A.voiceLead([A.chord('Amaj9', 4)])[0], { type: 'air', attack: 0.02, release: 2.5, vel: 0.8 });
sonicLogo(CUE.final + 0.02, 0.5);

// ---- the narration (the dubbed cut) --------------------------------------------------------------------------------
if (VO) {
  const lines = Object.keys(VO_WORDS);
  for (const n of lines) A.sample(VO_AT[n], `audio/kit/${n}.wav`, { align: 'start', bus: 'vo' });
  // the music rides under every line: down 10 dB 0.12 s before the first word, back up 0.25 s after the last
  const ride = (depth) => {
    const ks = [[0, 0]];
    for (const n of lines) {
      const a = LINE[n] - 0.15, z = END[n] + 0.1;
      ks.push([a - 0.12, 0], [a, -depth], [z, -depth], [z + 0.3, 0]);
    }
    ks.push([DURATION, 0]);
    return ks;
  };
  A.automate('music', 'gain', ride(12));
  A.automate('lead', 'gain', ride(15));
  A.automate('drums', 'gain', ride(10));
  A.automate('bass', 'gain', ride(9));
  A.automate('fx', 'gain', ride(6));
}

A.render(out, { lufs: -14, reverb: 'hall', delay: { beats: 0.75, feedback: 0.3, lp: 3800 }, glue: 0.1, fadeOut: 1.2, sections: S });
