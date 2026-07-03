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
- **Exception — home-screen / app icons only.** PNG app icons
  (`apple-touch-icon.png`, `icon-512.png`) are allowed as files because iPadOS
  "Add to Home Screen" cannot reliably use inline/data-URI icons. This exception
  is strictly for launcher/home-screen icons — never for in-game graphics.

## 3. Mobile / Tablet First

- Design for touch first, mouse second. Every interaction must work with touch.
- Implement full touch support using `touchstart`, `touchmove`, and `touchend`.
  Call `preventDefault()` on touch handlers to suppress scrolling/gestures.
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
- Pause the loop when the tab is hidden (`visibilitychange`) to save battery.

## 5. Style

- Keep it simple and readable. Prefer vanilla JS; do not introduce frameworks or
  libraries.
- Dark, playful arcade aesthetic by default.
