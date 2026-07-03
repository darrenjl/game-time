# Game Time — Development Guide

This repository builds **mobile-first, touch-driven browser games for Oisín &
Finley**. Name games, titles, and UI copy for **both** of them. All future
development MUST follow the rules below. They are strict and override any default
tendencies.

## 1. Architecture — Single File

- The **entire game** — logic, canvas rendering loop, CSS styling, and all UI
  elements — MUST live inside a single, self-contained `index.html` file.
- No build step, no bundler, no module imports, no external JS/CSS files.
- CSS goes in a `<style>` block; JavaScript goes in a `<script>` block; both
  inside `index.html`.
- The file must open and run correctly by double-clicking it or serving it
  statically (e.g. GitHub Pages) with zero configuration.

## 2. Assets — No External Files

- All graphics MUST be produced with the **HTML5 Canvas API**, **inline SVG**, or
  **Emoji**.
- No external image files (`.png`, `.jpg`, `.gif`, `.svg` files), no sprite
  sheets, no asset pipelines, no CDN-hosted media.
- Audio, if used, must be generated via the Web Audio API rather than loaded from
  files.
- **Only use emoji that predate iOS 12** (Unicode Emoji ≤ 11.0, ~2018). Newer
  emoji such as 🪨 🪸 🟫 🪙 (Emoji 12–13) render as blank boxes on the iPad mini 2.
  If you need such an object, **draw it on canvas** instead. Older emoji like
  🐙 🐕 ⭐ 🚀 💎 🔮 🌿 are safe. (This is why the maze walls/coin are canvas-drawn.)
- **Exception — home-screen / app icons only.** PNG app icons
  (`apple-touch-icon.png`, `icon-512.png`) are allowed as files because iPadOS
  "Add to Home Screen" cannot reliably use inline/data-URI icons. This exception
  is strictly for launcher/home-screen icons — never for in-game graphics.

## 3. Mobile / Tablet First

- Design for touch first, mouse second. Every interaction must work with touch.
- Implement taps and swipes via `touchstart`/`touchend` (derive swipe direction
  from the start→end positions). Also wire `mousedown`/keyboard for desktop testing.
- **Stop the page scrolling during play:** add a **non-passive** `touchmove`
  listener that calls `preventDefault()` on *every* touch (not only multi-finger).
  `touch-action`/`overscroll-behavior` are **not** honoured on iOS 12, so a
  single-finger swipe will scroll the tablet without this.
- **Don't let a full-screen tap handler swallow button clicks.** If a container
  (e.g. the game stage) has a tap handler that calls `preventDefault()`, bail out
  when the tap lands on a control: `if (e.target.closest('button, a')) return;` —
  otherwise Play Again / Resume / menu buttons won't fire on touch.
- The viewport must lock to the device screen:
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0,
    maximum-scale=1.0, user-scalable=no, viewport-fit=cover">`
  - Prevent rubber-banding / overscroll: `overscroll-behavior: none` and
    `touch-action: none` on the body and canvas.
  - Prevent pinch-to-zoom and double-tap zoom.
- On-screen controls must be **large touch targets** (minimum 44×44 CSS px,
  prefer bigger) and comfortably reachable with thumbs.
- The canvas should size responsively to the viewport (account for
  `devicePixelRatio` for crisp rendering) and re-layout on `resize` /
  `orientationchange`.

## 4. Game Loop & State

- Drive rendering with `requestAnimationFrame`. Never use `setInterval` for the
  main loop.
- Use delta-time between frames so motion is frame-rate independent.
- Maintain explicit game state with at least these phases:
  - `START` — title / ready screen awaiting first input.
  - `PLAYING` — active gameplay.
  - `GAME_OVER` — end screen with a way to reset.
- Provide clean **start**, **play**, and **reset** transitions. Resetting must
  fully restore initial state without reloading the page.
- Optionally add a `PAUSED` state (skip `update()` while paused; keep rendering).
  A pause menu is a good home for settings like difficulty/speed — persist the
  choice in `localStorage`.
- Pause the loop when the tab is hidden (`visibilitychange`) to save battery.

## 5. Browser Compatibility

Games must run on **older iPads** as well as new ones. The baseline target is
**Safari 12 / iOS 12** (e.g. the iPad mini 2, which cannot update past iOS
12.5.7). Several modern CSS features are silently ignored on that browser and
break layout, so always provide a fallback declaration *before* the modern one:

- **`inset: 0`** is unsupported — use `top: 0; right: 0; bottom: 0; left: 0;`.
- **`clamp()`** (fonts/spacing) is unsupported — precede each `clamp()` with a
  fixed fallback value on its own line (`font-size: 2rem; font-size: clamp(...)`).
- **Flexbox `gap`** is unsupported — for flex containers, use sibling margins
  (`.box > * + * { margin-top: N }`). Grid `gap` is fine.
- **`dvh` units** are unsupported — precede `100dvh` with a `100vh` fallback.
- **`backdrop-filter`** needs the `-webkit-backdrop-filter` prefix on iOS.
- Avoid **`aspect-ratio`** and **`overscroll-behavior`** as load-bearing; treat
  them as progressive enhancement only.
- Keep JavaScript to widely-supported syntax (the games use ES5-style `var` /
  `function`, `requestAnimationFrame`, Canvas 2D, touch events — all fine on
  Safari 12).

## 6. Home-Screen (Standalone) Behaviour

Games are added to the iPad home screen and run full-screen
(`apple-mobile-web-app-capable`). Handle the standalone quirks:

- Link each page to the shared icons (`../apple-touch-icon.png`, `../icon-512.png`)
  and set `apple-mobile-web-app-title`.
- **Include a manual refresh (🔄) button.** Standalone apps resume the frozen page
  on reopen instead of reloading, so this is the only way to pull a new version.
  (Avoid auto-reloading on focus — it resets an in-progress game.)
- **Keep links in-app on old iOS only.** On iOS < 13 standalone, `<a>` links break
  out to a Safari tab — intercept clicks and use `location.href`. iOS 13+ keeps
  links in-app natively, and forcing `location.href` there opens a *new tab*, so
  gate the workaround to iOS < 13 (parse the major version from the UA).

## 7. Deployment

- Hosted on **GitHub Pages**, deploying from `main` → https://darrenjl.github.io/game-time/.
  Pushing to `main` triggers a build; the `deploy-pages` step is occasionally
  flaky ("Deployment failed, try again later") — just re-run it.
- `netlify.toml` is committed as a ready alternative host (does nothing unless a
  Netlify site is connected).

## 8. Style

- Keep it simple and readable. Prefer vanilla JS; do not introduce frameworks or
  libraries.
- Dark, playful arcade aesthetic by default.
