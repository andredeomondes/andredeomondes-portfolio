# UI Registry

## Baseline — Engineering Notebook

Established: 2026-10-12

| Property | Pattern |
| --- | --- |
| Page background | `bg-ink` (`#050505`) |
| Panel background | `bg-panel` (`#0c0c0c`) |
| Light surface | `bg-paper` (`#f4f4f0`) |
| Border | `border-line` (`#252525`), 1px |
| Border radius | None for editorial/public surfaces |
| Text — primary | `text-paper` |
| Text — secondary | `text-dim` (`#9a9a94`) |
| Accent | `text-signal` / `bg-signal` (`#f7c928`) |
| UI labels | Geist Mono, uppercase, 0.14–0.17em tracking |
| Display headings | Geist Sans, weight 600, tight negative tracking |
| Content width | `.site-shell`, max 86rem |
| Grid texture | 28px technical grid, low contrast |
| Hover | Signal-colored border/text; no floating glass cards |
| Shadow | None |

### Navigation

File: `src/shared/components/layout/navbar.tsx`

Fixed matte-black bar, one-pixel bottom rule, square monogram, compact monospaced links, and a rectangular contact action. Mobile navigation uses full-width ruled rows.

### Publication Card

File: `src/shared/components/editorial/publication-card.tsx`

Horizontal ruled entry with a square carousel cover, unit metadata, large title and a square arrow control. On small screens the content becomes a single column without changing the visual language.

### Buttons

Primary buttons use signal yellow with black type. Secondary buttons use black with graphite border. All buttons are rectangular, monospaced and uppercase.

### Editorial Sections

File: `src/features/home/components/editorial-home.tsx`

Sections are separated by full-width one-pixel rules. Content uses asymmetric grids, oversized headings and numbered technical labels. White sections are reserved for portfolio evidence and high-contrast pacing.

### Home Hero

File: `src/features/home/components/editorial-home.tsx`
Last updated: 2026-10-13

The opening hero is a single editorial field with no profile sidebar. The name owns the composition while a low-contrast SVG architecture trace runs behind its right edge. The trace uses one signal-yellow moving dash and three restrained node pulses; it is decorative, loops without changing layout, remains hidden on small screens and stops under reduced-motion preferences. Profile location appears only as a compact factual footer label.

### Carousel Viewer

File: `src/shared/components/editorial/carousel-viewer.tsx`

One 4:5 card is visible at a time inside a ruled technical frame. Previous/next controls stay over the image, while numbered controls and a live counter make position explicit. Keyboard arrows and horizontal touch gestures mirror the visible controls.

### Exercise Workbench

File: `src/shared/components/editorial/exercise-workbench.tsx`

The learning material is organized by exercise rather than by source file. A compact, categorized rail selects one problem at a time; on smaller screens it becomes a bounded scroll area so the active lesson stays close. Each exercise follows the same numbered learning sequence: enunciado, starter, concrete input/output examples, runnable test instructions, progressive hints, and an always-visible reviewed reference solution. Test examples use ruled two-column rows, commands sit in ink panels with compact copy controls, and full test source stays collapsed until requested. The selected item and progress rule use signal yellow; reading surfaces remain square, ruled, and matte black.

### Project Case Study

File: `src/app/projects/[slug]/page.tsx`
Last updated: 2026-10-12

| Property | Class |
| --- | --- |
| Background | `bg-ink`, alternating `bg-panel` and `bg-paper` sections |
| Border | `border-line`, one-pixel ruled divisions |
| Border radius | None |
| Text — primary | `text-paper`, `text-ink` on light evidence sections |
| Text — secondary | `text-dim`, `text-ink/65` on light sections |
| Spacing | Section rhythm `py-16 sm:py-24`; internal panels `p-5` to `p-8` |
| Hover state | `text-signal`, screenshot scale `1.018`, signal frame and visible zoom action |
| Shadow | None |
| Accent usage | Signal yellow for numbering, architecture arrows and primary action |

**Pattern notes:**
Recruiter-facing cases use a factual sequence: context, real screenshots, personal contribution, system architecture, technologies, production, quality and lessons. Screenshots preserve their source aspect ratio and always include captions. Clicking a screenshot opens an accessible in-page lightbox rather than navigating to the asset; Escape, the close control and backdrop dismiss it, body scroll is locked, and focus returns to the image trigger. Architecture uses horizontal ruled nodes on desktop and vertical nodes on mobile. Personal contribution remains visually separate from total product scope, especially for team projects. Hosting, providers and metrics appear only when confirmed.

### About Portrait

File: `src/app/about/page.tsx`
Last updated: 2026-10-12

| Property | Class |
| --- | --- |
| Background | `bg-panel` |
| Border | `border-line` |
| Border radius | None |
| Image treatment | `object-cover object-top grayscale` |
| Spacing | Portrait participates in the existing editorial hero grid |
| Hover state | None |
| Shadow | None |
| Accent usage | Signal-yellow location label over the lower-left corner |

**Pattern notes:**
Profile photography remains documentary and monochrome. Use the original portrait without generated effects; the only overlay is a compact factual location label.

### Technology Icon

File: `src/shared/components/editorial/technology-icon.tsx`
Last updated: 2026-10-12

| Property | Class |
| --- | --- |
| Background | Transparent; parent may use `bg-ink`, `bg-panel` or `bg-paper` |
| Border | Parent icon tile uses the surface's existing one-pixel border token |
| Border radius | None |
| Text — primary | Inherits current color |
| Text — secondary | Not applicable |
| Spacing | `inline-flex`, `gap-1`; icon size follows `1em` |
| Hover state | Inherits parent control state |
| Shadow | None |
| Accent usage | `text-signal` for diagrams and integrations; muted ink for the light stack section |

**Pattern notes:**
Use official monochrome brand marks only for named technologies and services. Functional concepts use Lucide's linear icons. Never introduce brand colors into the portfolio palette. Architecture nodes may show at most two marks when the node intentionally groups tools; chips and stack entries use one mark.

### Site Motion

File: `src/shared/components/motion/site-motion.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Focal entrance | Signal-yellow route scanline plus SplitText line masks on the display heading |
| Route continuity | Native View Transitions; persistent navigation, 180ms exit and 360ms entrance |
| Section reveal | Temporary signal rule, masked heading lines and supporting copy with asymmetric timing |
| List cadence | `0.045s` stagger, capped to visible ScrollTrigger batches |
| Image reveal | Ink overlay retracts with `scaleY`; image settles from `scale: 1.025` |
| Architecture | Ink lane overlay, staggered nodes/arrows and SVG stroke draw-on |
| Scroll depth | Signal-yellow progress rule plus subtle scrubbed depth on technical-grid fields |
| Ambient grid | 22s diagonal drift and 16s signal pulse; runs only while the grid intersects the viewport |
| Section scan | One-pixel signal rule grows with scroll progress as each top-level section enters |
| Card scan | A single low-opacity inspection sweep crosses cards on first reveal and is clipped to the card boundary |
| Ambient signals | Signal square pulse, outline breathing and directional architecture arrows run only while visible |
| Interaction | Control shine on hover, directional icon response, nav underline, carousel change, mobile-menu sequence and exercise-panel continuity |
| Performance | Transform, opacity and clip-safe overlays; lazy GSAP loading, batched triggers, intersection-paused loops and scoped cleanup |
| Accessibility | `gsap.matchMedia()` removes spatial motion but retains ≤150ms opacity cues; CSS loops, scans and scroll progress are removed under reduced motion |

**Pattern notes:**
Motion follows the same engineering-notebook metaphor as the visual system: headings are assembled line by line, dark covers retract like inspected panels, architecture paths draw as connections become available, and technical signals show that the system is active. Use GSAP match-media contexts with cleanup for every React-owned animation. Keep routine feedback between 0.12s and 0.38s, authored entrances below 0.75s, and preserve the navigation bar across route transitions. Ambient loops are restricted to the technical grid, signal square, outline heading and architecture connectors; they must remain low contrast, pause offscreen and disappear under reduced motion. Do not add bounce, elastic easing, full-surface bright flashes or animation that changes layout-driving properties.
