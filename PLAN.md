# Arcade Expansion Plan — New Games for Oisín & Finley

Goal: add games that fill mechanic gaps in the arcade and suit **both** a 3-year-old
(Oisín) and a 6-year-old (Finley), built to the repo's hard rules (single-file
`index.html`, canvas/SVG/emoji only, Safari 12 / iPad mini 2 baseline, touch-first).

## Research basis (July 2026)

- **3-year-olds** want *tap-and-react* / *no-fail* mechanics: bubble-popping,
  whack-a-mole tapping, shape/colour matching. Repetition + instant feedback.
- **6-year-olds** want *skill + score*: fast tap/swipe arcade (Fruit Ninja, Subway
  Surfers), memory/matching, light physics puzzles.
- Whack-a-mole and memory-match are the two most-cloned beginner canvas games.

Sources: Common Sense Media (5–8 apps), Arcadino (kids browser games), SplashLearn
(toddler games), My Baby Wonder (bubble-pop), JetLearn (10 easy JS games).

Existing arcade genres = collector (Crystal Hunt), platformer (Jumping Adventure),
maze (Octopus). All are "steer a character." No tap-reflex, memory, or swipe game
exists yet — the picks below fill exactly those gaps.

## Art direction — canvas-first (decided)

Emoji are **not** the primary art. Reasons: (1) emoji can't animate or transform (you
can't slice a 🍉 in half or make a critter bob), (2) it's off-style — the repo already
draws its heroes on canvas (the Jumping Adventure astronaut, the maze walls/coin),
(3) a blank-box render breaks games like Memory Match.

Rules:
- **All interactive/hero characters are drawn on the HTML5 Canvas.** Full animation
  control, guaranteed rendering, one cohesive bright look per game.
- **Emoji only for static, non-load-bearing décor**, and only from the verified
  Emoji 1.0 (2015) set. UI chrome emoji already in the repo (⬅️ ⏸️ 🔄 ▶️ 🔁 👆 🐢 🙂
  🐇 ⚡) are safe and stay.
- **No emoji in gameplay-critical spots** (e.g. Memory Match tiles → canvas creatures).

## Shared foundation (every new game reuses this)

Clone the *Jumping Adventure* scaffold rather than reinventing it:
- Top bar: `⬅️ Back` → `../index.html`, live score, `⏸️` pause, `🔄` refresh.
- Overlays: `START` (title + 👆 hint), `PAUSED` (difficulty picker + Resume),
  `GAME_OVER` (Play Again). Same `.overlay` / `.bigbtn` styling.
- Engine: dpr-aware `resize()`, delta-time `requestAnimationFrame` loop, explicit
  `STATE` machine, `visibilitychange` reset of `lastTs`.
- Touch: non-passive `touchmove` `preventDefault`, `gesturestart` block, the
  `if (e.target.closest('button, a')) return;` guard, iOS-<13 standalone link fix.
- iOS-12 CSS fallbacks: `100vh` before `100dvh`, fixed value before `clamp()`,
  sibling-margin gap fallback, `top/right/bottom/left` (not `inset`),
  `-webkit-backdrop-filter`.
- Storage: difficulty + best score in `localStorage` under per-game keys.

## Storage decision

`localStorage` only for MVP (per-device best score + difficulty). **No Supabase.**
Optional future phase: one Supabase project for a shared cross-iPad leaderboard
(Oisín vs Finley high scores) — only if the shared-rivalry feature is wanted.

## The three games

### 1. Peekaboo Meadow — tap-reflex (best for Oisín, 3) — BUILDING FIRST
- Theme: sunny meadow, blue sky, sun, clouds, green hills; 3×3 ring of dirt burrows.
- Characters (canvas-drawn): heroes **Ozzie the mole** (Oisín) & **Finn the frog**
  (Finley), plus bunny & chick, peek out of burrows. Tap for a high-five (+score,
  sparkle). **Buzz the grumpy bee** = don't tap (costs a life; 3 lives).
- Forgiving: missing a hero is free. Fail state = bees only (rare on Chill, common on
  Zoom) → real challenge for Finley, gentle for Oisín.
- Difficulty (pause menu, persisted `pm_diff`): 🐢 Chill / 🙂 Normal / 🐇 Fast / ⚡ Zoom
  = pop speed, hold time, bee frequency, max critters up. Best score `pm_best`.
- Palette: grass `#57c785`, sky `#4fb0f7`, flower pink `#ff7eb6` / gold `#ffd166`.

### 2. Ocean Memory Match — memory pairs (spans both boys via grid size)
- Theme: undersea (ties to the octopus game), animated bubble background on canvas.
- Cards: **canvas-drawn** sea creatures (fish, crab, turtle, starfish, octopus,
  whale…) on teal coral-patterned backs. No emoji tiles.
- Flip two → match (lock + sparkle) or flip back. Win when board cleared. No fail
  state (ideal for Oisín); scored on moves/time for Finley.
- Difficulty (`omm_diff`): 🐢 Easy 2×3 / 🙂 Normal 4×4 / ⚡ Hard 4×5. Best (fewest
  moves per size) `omm_best_<size>`.
- Palette: teal `#00e5cc`, coral `#ff5d8f`, deep sea `#052a4a`.

### 3. Fruit Splash — swipe-to-slice (best for Finley, 6)
- Theme: tropical sunset; fruit arcs up from the bottom, swipe to slice into two
  canvas halves + juice-particle burst.
- Characters (canvas-drawn): sliceable fruits (melon, strawberry, apple, orange,
  banana, grapes), a **bomb** to avoid (slicing it ends the run), and **Chomp the
  croc** mascot cheering along the base.
- Swipe via `touchmove` path crossing a fruit's circle. Score per fruit + combo bonus.
- Difficulty (`fs_diff`): spawn rate / fruit speed. Best score `fs_best`.
- Palette: sunset orange `#ff8a3d` → pink `#ff5d8f` → purple `#8b5cf6`.

## Build order — all three BUILT & verified (2026-07-04)

1. **Peekaboo Meadow** — `peekaboo-meadow/index.html` ✅ built + card added. Verified:
   critters pop correctly in the burrows, tap-to-score works, no console errors.
2. **Ocean Memory Match** — `ocean-memory-match/index.html` ✅ built + card added.
   Verified: board/backs render, flip animation + reveal (pixel-confirmed), compare/
   moves counter works, creature art renders, no console errors.
3. **Fruit Splash** — `fruit-splash/index.html` ✅ built + card added. Verified: fruit
   spawn/render, swipe-slicing scores, bomb-slice → game over, misses → game over,
   best-score persistence, swipe trail, no console errors.

Verified statically at an iPad-mini viewport (768×1024) via headless browser. Defaults
taken: heroes named after the boys (Ozzie/Finn), `localStorage` only (no Supabase yet).

Remaining manual check: confirm on the real iPad mini 2 (touch swipes, standalone
home-screen refresh, no page scroll) before relying on it in the wild.

## Shortlist — next games after these three (from the research)

Ranked by appeal × how cleanly they clone in this stack, with the gap each fills:

1. **Catch the Falling Fruit/Stars** — drag/tilt a basket to catch falling objects,
   dodge duds. Both ages; trivial canvas physics. Gap: *catching/positioning*.
2. **Bubble Pop** — floating bubbles drift up; tap to pop with a satisfying burst.
   Pure toddler joy (Oisín), colour/number variants for Finley. Gap: *calm endless tap*.
3. **Colour/Shape Sort** — drag creatures into matching-colour bins. Learning-flavoured,
   no-fail for a 3-year-old. Gap: *drag-and-drop sorting*.
4. **Simon Says (light + sound)** — repeat the growing colour/tone sequence via Web
   Audio. Classic memory skill game for Finley. Gap: *sequence memory + generated audio*.
5. **Lane Runner / Dodge** — swipe left/right between lanes to dodge obstacles and grab
   coins (Subway-Surfers-lite). High 6-year-old appeal. Gap: *endless runner*.
