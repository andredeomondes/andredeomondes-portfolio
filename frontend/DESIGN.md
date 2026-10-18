# Visual System — Clean Tech + 8-bit Accents

Last updated: 2026-10-17 · Source: `docs/superpowers/specs/2026-10-17-redesign-8bit-design.md`

## World

A clean, animated engineering studio in the spirit of Visuvate, signed with restrained retro details: pixel type on a few key words, block cursors, pixel reveals and glitch. Game nostalgia is seasoning, never the theme — no arcade title screens, score HUDs or sprites.

## Palette

- Background: `#070707` (`--color-ink`)
- Panel: `#0e0e0e` (`--color-panel`)
- Foreground: `#f3f3ef` (`--color-paper`)
- Muted: `#8b8b86` (`--color-dim`)
- Line: `rgba(255,255,255,.08)` (`--color-line`)
- JS yellow: `#f7df1e` (`--color-signal` / `--color-js`)
- Status OK only: `#22c55e`

Yellow is the single accent: pixel highlight words, cursor, active status, active nav, focus, progress bars and the IDE glow. It stays within 5–10% of any screen and is never a large surface or body-copy color. The whole site is dark; there are no light "paper" chapters.

## Type

JetBrains Mono (300–800) carries everything. Headings use 800 with `-0.045em` tracking. Silkscreen (`font-pixel`) is reserved for 1–2 highlight words per heading, short labels and the marquee — never a full sentence, never below 11px. Headings mix both on one line, the key word in pixel (and optionally yellow): "Sistemas que **rodam** em **produção**".

## Material

14px radius on panels and cards, 10px on buttons, 1px `--color-line` borders. Glass (14px blur) only on the pill navbar and overlays; everything else is opaque. A 48px grid texture, radially masked, appears only in the home hero. Pixel details: 3×3 logo mark with a yellow center, `■` bullets, block cursor, block progress bars.

## Images

The portrait is shown normally — full color, no filter; hover is a light `scale(1.03)` only. Project screenshots start grayscale under a scattered pixel cover; on hover the pixels clear in blocks and the image recovers color.

## Motion

GSAP + ScrollTrigger for scroll-linked sequences, `motion/react` for component micro-interactions. Animate only transform, opacity, clip-path and mask. Loops pause offscreen and in hidden tabs. Under `prefers-reduced-motion: reduce` every loop stops and content shows its final state. Main text is visible within ~1s and content stays readable without JavaScript.

Signature moments: masked word-rise on the hero title; the live IDE (typed code, incoming requests, latency bars) that straightens on scroll; the Silkscreen stack marquee; the manifesto lighting up word by word; pixel reveal on screenshots; attribute bars filling block by block; and the looping "Vamos construir algo que roda." finale (8-bit hop wave, glyph scramble with glitch, cycling build status, block progress bar, sliding "RODA ▶" bands). Route changes use a short pixel-mask view transition (≤300ms), never a fullscreen loader.
