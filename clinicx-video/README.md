# Clinicx — promo

75 s, 9:16, 60 fps; a voiced problem → solution promo; breakbeat 124 BPM, F♯ minor → A major. Two cuts with the same
picture: `clinicx-promo-dublado.mp4` (narration, music ducked under it) and `clinicx-promo.mp4` (music only).

Everything is code: the picture is an HTML page rendered frame by frame in headless Chrome with motion blur; the score
and every sound effect are synthesised in Node on the same timeline. The narration is pt-BR-AntonioNeural (edge-tts)
from `vo/script.json`. Facts and their sources: `brief.md`; the critique rounds: `REVIEW.md`.

## Direction card

- Film in one line (what the viewer feels and does at the end): the clinic owner sees their own daily losses pile up,
  watches the Clinicx » slice through them, and leaves knowing it starts at R$ 79,90 with 7 days free at clinicx.app.br.
- Read from (the person's words quoted, what they gave, where it plays, the brand's voice): "quero um video longo com
  varias animacoes" ("a long video with many animations"); "primeiro fale um problema depois apresente o software como
  solução" ("first a problem, then the software as the solution"); "uma opção com dublagem e uma sem" ("one dubbed,
  one without"); "faça efeitos motion completos" ("full motion effects"); "use componentes do site", "a paleta de cor
  do site", "coloque o fluxo" ("use the site's components and palette, show the flow"); inspiration: Instagram
  @sistemaclinicx (deep-navy posts, green/blue highlights, a robot, "Sua clínica pode faturar mais!"). Given: the
  site (white, Poppins, blue #2F7FDD + green X, transparent PNG mock-ups of the real UI). Plays: Instagram Reels /
  Stories, 9:16, sound on, but the words on screen carry the story muted. Voice: confident, short commercial lines.
- Concept (the device carried from the first frame to the last, and its signature moment): **the » cuts through** —
  the problem is a pile of red, shaking chaos (no-show slots, a forgotten budget, a flooding WhatsApp, a cash line
  that falls); from the question on, the logo's double chevron » is the only transition: every scene change is a »
  slicing across the frame and leaving order behind. Signature: on the drop the » tears the whole chaos frame apart
  in two halves and lands as the X of the wordmark, which assembles letter by letter on "Clínix".
- Not taken (the other two concepts, one line each): (a) one notification card that never cuts and morphs into each
  screen — strong, but the site's UI is many separate mock-ups, not one element; (b) a day in the clinic on a clock
  face 08:00 → 08:00 — needs facts about hours the brief does not hold.
- Look (a card from look-cards.md, and what changes for this brand): Data story (dark navy) leading, with the Product
  film's real UI crops on white cards — the Instagram's navy ground, the site's white cards, blue and green. Problem
  act: a colder near-black, the site's #CC3366 as the only colour, jitter and glitch; solution acts: navy with blue
  light fields, the green for the key word.
- Energy (per scene = ENERGY, and where it came from — their words, the references, the promo default, a reason for calm): mid in the problem act (driving but held under the narration) → high from the drop on the reveal to the end card; from "efeitos motion completos" and "várias animações" — "full motion effects, many animations" — plus the promo default.
- Mood (bright or dark, playful or serious): dark → bright: serious and tense in the problem, confident and clean
  after the reveal.
- Sound role (music-led or ui-led): voice-led in the dubbed cut (music ducks ~12 dB under each line), music-led in
  the music-only cut; ui pops tuned to the key for every card, check and notification.
- Palette (roles → hex): ground #071435 · navy #0D2463 · brand blue #2F7FDD · button blue #2A6DF6 · green (X, key
  word, "7 DIAS GRÁTIS") #60DE80 · problem #CC3366 on #0A0D16 · white #FFFFFF · muted #9FB1D6.
- Type (families, weights, sizes, the accent face): Poppins 800 for statements (110–180 px), 600 for labels
  (34–44 px), Poppins 700 for numbers; the accent word in green (solution) or #CC3366 (problem); never below 30 px.
- Hard cuts (beats): CUE.hole (the stop) and CUE.drop; every other change is a » slice or a match move.
- Banned in this video: a scene counter or chapter label ("01 / 06"), HUD (timecodes, BPM, corner brackets),
  cross-fades, a logo alone on black first, emoji, invented numbers or reviews, stock icons, redrawn UI the site
  does not show, the site's spam footer, a kick on every beat.

## Story

| Time | Line (VO) | Picture — how it enters, what holds, how it leaves | Sound |
|---|---|---|---|
| 0–4.2 s | "Sua clínica está perdendo dinheiro. Todos os dias." | already moving: a red R$ drains down a cracked ground; PERDENDO DINHEIRO slams on "dinheiro", TODOS OS DIAS stamps | the groove from bar 1 (filtered), a low hit per slam |
| 4.8–12.3 s | "Paciente que falta… Orçamento esquecido… WhatsApp lotado…" | three problems, one per phrase: an agenda column whose slots flip to FALTOU; a budget card sliding into a drawer, greying; a phone whose unread bubbles flood and stack | glitch per slot, a drawer slam, a bubble pop flood |
| 13–16.9 s | "E no fim do mês… a conta não fecha." | the three collapse into a red cash line that falls off the frame; A CONTA NÃO FECHA; the hole: everything freezes | the music drops out, a sub drop |
| 16.9–21.3 s | "E se a sua clínica trabalhasse por você, 24 horas por dia?" | a » cuts in, the frame turns navy; 24H rolls in huge, a clock ring closes | riser, the groove returns thin |
| 21.3–27 s | "Conheça a Clínix. Gestão inteligente…" | the » tears the frame (signature), lands as the X; the wordmark rises; the tagline | THE DROP; the sonic logo |
| 27–35.8 s | agents | the real agents panel tilts in; three checks tick on "confirmam / recuperam / trazem"; a WhatsApp-green pill "24h" | a pop per check |
| 35.8–49.8 s | flow + notify | THE FLOW: the site's journey as four nodes that light one per verb, a line drawing between them; then a phone with the real notifications stacking on "lembretes, termos, receitas, pagamentos" | a tick per node, a notification chime each |
| 49.8–61.5 s | platform + crc | the real dashboard in 3D, four module tiles slam on their words; TUDO EM UM SÓ LUGAR; the CRC kanban and QUEM É LEMBRADO, É ESCOLHIDO | slams on words |
| 61.5–67.7 s | plans | the four plan cards from the site, R$ 79,90 rolls, the 7 DIAS GRÁTIS badges pop | a till ding on the price |
| 67.7–75 s | cta | lockup: wordmark, "Teste 7 dias grátis", clinicx.app.br, @sistemaclinicx — held 5 s | the sonic logo, tail |

## Sound brief

- Feel / genre: driving breakbeat (genre card 19), modern and clean, not a club track — it must sit under a voice.
- Tempo & key: 124 BPM; F♯ minor in the problem act, A major (its relative) from the drop.
- Groove: broken kick, snare on 2 and 4, busy 16th hats; filtered in the problem act, open from the drop.
- Kit: warm, round (sound-print) — tight kick, crisp snare, shaker.
- Percussion: shaker 16ths, a ride on the solution acts.
- Bass: round sub with a short pluck, following the roots.
- Harmony: problem F♯m – D – A – E (tense, minor); solution A – E – F♯m – D (bright).
- Hook (sonic logo): a rising three-note figure A – C♯ – E (the » moving forward) on the logo and the end card.
- Brand world: phone notification chimes, WhatsApp-like pops, a soft till ding, a glitch for each no-show.
- Energy map: = ENERGY (mid → high from the drop).
- Transitions: a whoosh for every » slice; a riser into the drop; the hole before it.
- Mix: −14 LUFS, true peak ≤ −1 dBTP; dubbed cut: music −12 dB under the voice, back up in the gaps.
- Not like the last one because: the first video in this folder.

## Build

```bash
.venv/bin/python -I vo/make-vo.py    # the narration (vo/script.json) → vo/*.mp3 + js/vo.data.mjs; then node tools/kit.mjs vo/*.mp3
node audio/score.mjs --vo            # the dubbed mix → out/music-vo.wav
node tools/render.mjs --skip-frames --audio out/music-vo.wav --out out/clinicx-promo-dublado.mp4   # the dubbed cut
node tools/plan-check.mjs            # the plan (js/timeline.mjs + the Energy line above) before any scene
node tools/capture.mjs sheet 0 <duration> 24     # contact sheet → out/sheet.png
node tools/capture.mjs verify        # every frame a function of t (forward, backward, shuffled)
node audio/score.mjs --report        # the score → out/music.wav (+ per-bus balance per scene)
node tools/audio-check.mjs           # loudness, balance, energy arc, uniqueness, out/qa/music-audio.png
node tools/capture.mjs review        # the critique set → out/review/ (score it in REVIEW.md)
node tools/render.mjs --draft        # quick preview with sound
node tools/render.mjs                # final → out/<slug>.mp4, out/<slug>-web.mp4, out/covers/, QA
node tools/aac.mjs out/*.mp4         # loudness and true peak of each delivery file (≤ -1 dBTP)
```

## Where things are

| Path | What |
|---|---|
| `js/timeline.mjs` | tempo, scene windows, cues, the energy plan — shared by picture and sound |
| `js/copy.mjs` | every word on screen and the contacts, per language |
| `js/scenes/*.js` | the scenes, in the order of `SCENES` in `js/reel.js` |
| `audio/score.mjs` | the score and the sound design |
| `audio/kit/` | recorded sounds the person supplied (`tools/kit.mjs`), with their licences in `KIT.md` |
| `assets/ui/` | the product's real interface, element by element (`ui-shot.mjs`) |
| `assets/footage/` | the person's clips: `scan.json`, a sheet per clip, the cut frames (`tools/footage.mjs`) |
| `css/style.css` | brand colours and shared styles |

## Assumptions

- "Clinicx" is spoken "Clínix" (one word, like "clinics"); the script spells it that way for the voice.
- 9:16 for Reels / TikTok (the person's choice); 75 s ("longo").
- The WhatsApp number stays off the end card (site + Instagram carry the CTA).

## Sessions

- 2026-10-14 — built from clinicx.app.br + Instagram @sistemaclinicx: brand kit, VO (edge-tts Antonio, `vo/`),
  timeline driven by the narration, 7 scenes, breakbeat score with `--vo` cut, review rounds 1–2. Renders:
  `out/clinicx-promo.mp4` (music) and `out/clinicx-promo-dublado.mp4` (`--skip-frames --audio out/music-vo.wav`).
  Found: the site's footer is full of hidden spam links (compromised WordPress) — told the client, nothing used.
  Left: see REVIEW.md "Still to change".
