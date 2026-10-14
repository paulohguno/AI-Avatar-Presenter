// ONE timeline for picture and sound. Scenes (js/scenes/*.js) and the score (audio/score.mjs) both import this file,
// so every slam, whoosh and cut lands on the same sample.
//
// A voiced film: the narration drives it. Each voice-over line starts on a beat (its first word lands on the beat),
// one after another with a breath between them; the scenes are built around the lines, and the animations inside a
// scene land on the words they illustrate (WORD()). The picture is the same for the dubbed and the music-only cut.
import { VO_WORDS } from './vo.data.mjs';

export const W = 1080; // @param width
export const H = 1920; // @param height
export const FPS = 60; // @param fps
export const BPM = 124; // @param bpm
export const BEAT = 60 / BPM;
export const BAR = 4 * BEAT;
/** Beats → seconds. */
export const b = (n) => n * BEAT;

// The lines in story order, and the breath in beats after each one ends before the next may start (rounded up to a
// whole beat). 'broke' → 'turn' is the hole: the music drops out under "a conta não fecha" and comes back with the
// question; 'turn' → 'reveal' gives the drop its run-up.
const ORDER = [
  ['hook', 0.5], ['chaos', 0.75], ['broke', 2.5], ['turn', 1.5], ['reveal', 1], ['agents', 1], ['flow', 0.75],
  ['notify', 1], ['platform', 0.75], ['crc', 1], ['plans', 1.5], ['cta', 0],
];
const FIRST = 1; // the first word of the film lands on beat 1 (0.48 s): the picture is already moving at frame 0

/** LINE[name] = the beat (seconds) the line's first word lands on; VO_AT[name] = where its clip starts playing. */
export const LINE = {};
export const VO_AT = {};
/** END[name] = when the line's last word ends. */
export const END = {};
{
  let beat = FIRST;
  for (const [name, gap] of ORDER) {
    const w = VO_WORDS[name];
    LINE[name] = b(beat);
    VO_AT[name] = LINE[name] - w[0][0];
    END[name] = VO_AT[name] + w[w.length - 1][1];
    beat = Math.ceil((END[name] + b(gap)) / BEAT - 1e-6);
  }
}
/** The absolute time of word i of a line (negative i counts from the end). */
export const WORD = (name, i) => { const w = VO_WORDS[name]; return VO_AT[name] + w[(i + w.length) % w.length][0]; };
/** The first word of a line whose text starts with `prefix` (case and accents ignored), from word `from` on. */
export const WORDAT = (name, prefix, from = 0) => {
  const n = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const w = VO_WORDS[name];
  for (let i = from; i < w.length; i++) if (n(w[i][2]).startsWith(n(prefix))) return VO_AT[name] + w[i][0];
  throw new Error(`no word "${prefix}" in line ${name}`);
};
/** The beat at or after t (seconds) — for cuts that must sit on the grid. */
export const onBeat = (t) => b(Math.ceil(t / BEAT - 1e-6));
const q = (t) => Math.round(t / BEAT) * BEAT; // the nearest beat

/** Named moments shared by the picture and the score (seconds). */
export const CUE = {
  start: 0,
  money: WORDAT('hook', 'dinheiro'),
  daily: WORDAT('hook', 'todos'),
  noshow: LINE.chaos, // "Paciente que falta…"
  budget: WORDAT('chaos', 'orcamento'),
  whats: WORDAT('chaos', 'whatsapp'),
  broke: LINE.broke,
  nofecha: WORDAT('broke', 'nao'),
  hole: onBeat(END.broke + 0.15), // everything stops: half a bar of near-silence
  turn: LINE.turn, // the question — the first chevron cuts through
  h24: WORDAT('turn', 'vinte'),
  slice: q(LINE.reveal - b(2)), // the double chevron slices the chaos away (the signature move)…
  drop: LINE.reveal, // …and the logo lands on the drop
  name: WORDAT('reveal', 'clinix'),
  tag: WORDAT('reveal', 'gestao'),
  agents: LINE.agents,
  confirm: WORDAT('agents', 'confirmam'),
  recover: WORDAT('agents', 'recuperam'),
  bring: WORDAT('agents', 'trazem'),
  viaWa: WORDAT('agents', 'tudo'),
  flow: LINE.flow,
  step1: WORDAT('flow', 'baixa'),
  step2: WORDAT('flow', 'escolhe'),
  step3: WORDAT('flow', 'solicita'),
  step4: WORDAT('flow', 'atendimento'),
  notify: LINE.notify,
  n1: WORDAT('notify', 'lembretes'),
  n2: WORDAT('notify', 'termos'),
  n3: WORDAT('notify', 'receitas'),
  n4: WORDAT('notify', 'pagamentos'),
  platform: LINE.platform,
  f1: WORDAT('platform', 'agenda'),
  f2: WORDAT('platform', 'prontuario'),
  f3: WORDAT('platform', 'financeiro'),
  f4: WORDAT('platform', 'crm'),
  allIn: WORDAT('platform', 'tudo'),
  crc: LINE.crc,
  chosen: WORDAT('crc', 'quem'),
  plans: LINE.plans,
  price: WORDAT('plans', 'setenta'),
  free: WORDAT('plans', 'com'),
  cta: LINE.cta,
  url: WORDAT('cta', 'comece'),
};
CUE.final = onBeat(END.cta + 0.2); // the last hit: the sonic logo's last note

/** Length of the video: the last hit, then the end card holds and the tail rings out. */
export const DURATION = CUE.final + b(5);

/** Scene windows [start, end] in seconds. Neighbours overlap: that is where the transitions live. */
const T = (name) => onBeat(LINE[name] - b(1)); // a scene arrives a beat before its line
export const S = {
  problem: [0, CUE.turn + b(1)],
  reveal: [CUE.turn - b(0.5), T('agents') + b(1)],
  agents: [T('agents'), T('flow') + b(1)],
  flow: [T('flow'), T('platform') + b(1)],
  platform: [T('platform'), T('plans') + b(1)],
  plans: [T('plans'), T('cta') + b(1)],
  lockup: [T('cta'), DURATION],
};

/** How hard each scene hits. The person asked for "efeitos motion completos" (full motion effects) and a
 *  problem → solution film with a narrator: the problem is tense and driving but held under the voice, the drop
 *  opens the full groove on the reveal and it stays there to the end card. */
export const ENERGY = { problem: 'mid', reveal: 'high', agents: 'high', flow: 'high', platform: 'high', plans: 'high', lockup: 'high' };

/** Fast moves: frames inside these windows get 16 motion-blur samples instead of 8. */
export const WHIPS = [
  [CUE.turn - 0.3, CUE.turn + 0.4], [CUE.slice - 0.1, CUE.drop + 0.5],
  ...['agents', 'flow', 'platform', 'plans', 'lockup'].map((n) => [S[n][0] - 0.05, S[n][0] + b(1.2)]),
];

/** Stills saved as covers / thumbnails after the final render. */
export const COVERS = [CUE.money + 0.5, CUE.name + 1, CUE.price + 1.2];

export const LOOP = false;
