# Visual System — Monochrome Glass + Signal Orange

Last updated: 2026-10-13

## World

The portfolio is a black-and-white engineering publication viewed through precise optical glass. Documentary evidence, technical diagrams and editorial typography stay neutral; a restrained burnt orange appears only when the interface is active. On light surfaces the signal inverts to ink to preserve the editorial rhythm.

## Palette

- Ink: `#050505`
- Glass ink: `rgba(12, 12, 12, 0.68–0.76)`
- Paper: `#f4f4f0`
- Silver: `#b8b8b2`
- Dim: `#9a9a94`
- Rule: `rgba(244, 244, 240, 0.14)` or solid `#252525`
- Signal orange: `#d95824`

Signal orange is reserved for selected navigation, focus, progress, typing cursors, route scans, small status indicators, action underlines and the interactive grid trail. It should occupy roughly 5–10% of any dark composition and never become a large surface, image treatment or body-copy color. Semantic states remain legible through contrast, icons and copy rather than hue alone.

## Type

Space Grotesk owns names, display statements and project titles. Geist Sans owns explanatory copy. Geist Mono is reserved for code, measurements, metadata and state. Display tracking never exceeds `-0.04em`; body copy stays within a readable measure.

## Material

Glass is structural. Use it for navigation, interactive evidence cards, forms, overlays and the footer atmosphere where it explains elevation or grouping. The recipe is translucent ink, 14–24px backdrop blur, a one-pixel white inset reflection and a soft downward black shadow. Do not wrap every section in a rounded glass card.

Light editorial chapters remain opaque paper for pacing. Their active signal inverts to ink.

## Motion

The focal interaction is the home engineering grid: the current cell becomes frosted signal-orange glass and movement leaves a short nine-cell trail that fades within 920ms. The pool is reused without component re-renders, stops offscreen with the hero and disappears under reduced-motion preferences.

Route transitions, scroll reveals and architecture motion stay restrained, use transform/opacity/masks, and never delay reading. Persistent progress rails are not used.

## Images

Documentary portraits, decorative atmospheres and rendered project screenshots remain monochrome. Screenshot hover and lightbox states may recover contrast and scale, never chromatic color; the original source files remain untouched.
