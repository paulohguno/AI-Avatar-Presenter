// The end card: "Clínix. Comece agora em clinicx.app.br." The X slices in at frame size and shrinks into the
// wordmark (the same move as the reveal, so the film closes on its own signature), the letters rise, then the call to
// action as the site's own blue button, the free trial in green, and the site and the Instagram large. Held with a
// slow push to the end; the X shines on the last hit.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, BEAT, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, fitFont, slam, shakes, ring, flash, drawSpeedLines } from '../kit.js';
import { ground, chevClip, chevBands, wordmark, icon } from '../brand.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '7';
  const bg = ground(root, { seed: 17 });
  const cam = el('div', 'layer', root);
  cam.style.transformOrigin = '50% 45%';
  const bands = chevBands(root);

  const wmW = 900 * U;
  const wm = await wordmark(cam, wmW);
  const wmX = (W - wmW) / 2, wmY = 700 * U;
  const shine = el('div', 'abs', cam);
  Object.assign(shine.style, { width: `${wmW}px`, height: `${wm.h}px`, background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,.55) 50%, transparent 60%)',
    mixBlendMode: 'overlay', WebkitMaskImage: 'none' });
  const cta = el('div', 'abs', cam, TX.cta);
  Object.assign(cta.style, { padding: `${34 * U}px ${80 * U}px`, borderRadius: `${22 * U}px`, background: 'var(--accent-2)', color: '#fff',
    font: `700 ${64 * U}px/1 var(--display)`, whiteSpace: 'nowrap', boxShadow: '0 24px 60px rgba(47,127,221,.45)' });
  const ctaW = cta.offsetWidth;
  const trial = el('div', 'abs', cam, TX.trial);
  Object.assign(trial.style, { font: `800 ${70 * U}px/1 var(--display)`, color: 'var(--accent)', whiteSpace: 'nowrap' });
  const trialW = fitFont(trial, W * 0.9);
  const contacts = TX.contacts.map((c) => {
    const d = el('div', 'abs', cam, `${icon(c.icon, 64 * U, 'currentColor', 3.5)}<span>${c.text}</span>`);
    Object.assign(d.style, { display: 'flex', alignItems: 'center', gap: `${22 * U}px`, font: `600 ${60 * U}px/1 var(--display)`, color: '#fff', whiteSpace: 'nowrap' });
    return { d, w: fitFont(d, W * 0.9) };
  });
  const shock = ring(cam, 520 * U, 7 * U, 'var(--accent)');

  const enter = [S.lockup[0], S.lockup[0] + b(1.1)];
  return (t) => {
    const on = t >= S.lockup[0] && t <= S.lockup[1];
    set(root, { vis: on });
    if (!on) return;
    const sp = P(t, enter[0], enter[1], ease.inOutSine);
    root.style.clipPath = chevClip(sp);
    bands(sp);
    bg(t, { pulse: t < CUE.final + 2 ? Math.exp(-((t % BEAT) / BEAT) * 5) : 0 });

    // the wordmark: the X lands on "Clínix" (the first word), the letters rise after it
    const xs = slam(t, CUE.cta - 0.05, { from: 3.5, dur: 0.3, overshoot: 0.05 });
    set(wm.el, { x: wmX, y: wmY, o: 1 });
    wm.x.forEach((p) => set(p, { s: xs.s, o: xs.o }));
    wm.letters.forEach((p, i) => {
      const t0 = CUE.cta + 0.12 + i * 0.05;
      const pp = ease.outBack(clamp((t - t0) / 0.32));
      set(p, { y: (1 - pp) * 160 * U, s: 0.6 + 0.4 * pp, o: clamp((t - t0) / 0.1) });
    });
    const shP = P(t, CUE.final, CUE.final + 0.7, ease.inOutSine);
    shine.style.backgroundPosition = `${lerp(-wmW, wmW, shP)}px 0`;
    shine.style.backgroundSize = `${wmW * 2}px 100%`;
    shine.style.backgroundRepeat = 'no-repeat';
    set(shine, { x: wmX, y: wmY, o: shP > 0 && shP < 1 ? 1 : 0 });

    // the call to action: the button on "Comece", the trial and the contacts after it
    const cs = slam(t, CUE.url - 0.05, { from: 1.4, dur: 0.22 });
    set(cta, { x: W / 2 - ctaW / 2, y: wmY + wm.h + 150 * U, s: cs.s, o: cs.o });
    const tp = ease.snap(clamp((t - CUE.url - 0.6) / 0.45));
    set(trial, { x: W / 2 - trialW / 2, y: wmY + wm.h + 340 * U + (1 - tp) * 50 * U, o: tp });
    contacts.forEach((c, i) => {
      const t0 = CUE.url + 1.0 + i * 0.3;
      const p = ease.snap(clamp((t - t0) / 0.45));
      set(c.d, { x: W / 2 - c.w / 2, y: wmY + wm.h + (500 + i * 110) * U + (1 - p) * 50 * U, o: p });
    });
    const rp = P(t, CUE.final, CUE.final + 0.8, ease.outCubic);
    set(shock, { x: W / 2 - 540 * U, y: wmY + wm.h / 2 - 540 * U, s: 0.3 + 1.5 * rp, o: t < CUE.final ? 0 : 0.7 * (1 - rp) });

    const sh = shakes(t, [CUE.cta - 0.05, CUE.url - 0.05], 14, 0.35);
    set(cam, { x: sh.x, y: sh.y, r: sh.r, s: 1 + 0.04 * P(t, CUE.url, S.lockup[1], ease.inOutSine) });
    if (sp > 0 && sp < 1) drawSpeedLines(ctx.fx, t, { seed: 31, n: 40, dir: 1, alpha: 0.35, speed: 8000, color: '96,222,128' });
  };
}
