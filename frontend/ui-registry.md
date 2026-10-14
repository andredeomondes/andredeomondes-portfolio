# UI Registry

## Baseline — Monochrome Glass Engineering

Established: 2026-10-12

| Property | Pattern |
| --- | --- |
| Page background | `bg-ink` (`#050505`) |
| Panel background | `bg-panel` as 72% ink glass over the active page atmosphere |
| Light surface | `bg-paper` (`#f4f4f0`) |
| Border | `border-line` (`#252525`), 1px |
| Border radius | None for editorial/public surfaces |
| Text — primary | `text-paper` |
| Text — secondary | `text-dim` (`#9a9a94`) |
| Accent | `text-signal` / `bg-signal` (`#f4f4f0`) |
| UI labels | Geist Mono, uppercase, 0.14–0.17em tracking |
| Display headings | Geist Sans, weight 600, tight negative tracking |
| Content width | `.site-shell`, max 86rem |
| Grid texture | 28px technical grid, low contrast |
| Hover | Paper-white border/text on ink; ink inversion on paper |
| Shadow | Soft black depth plus a one-pixel inset white reflection on elevated glass only |

### Navigation

File: `src/shared/components/layout/navbar.tsx`
Last updated: 2026-10-13

Fixed navigation with two scroll-aware states: at the top it is an edge-to-edge translucent ink rail with a single bottom rule; after 24px it contracts into a floating monochrome glass panel with graphite border, 14px radius and restrained blur. The navigation owns the highest public-interface layer, above route scanlines, so page signals never cross its surface. The wordmark is always `ANDREDEOMONDES.DEV`, with `.DEV` in neutral silver. Desktop keeps a left identity / center navigation / right availability-and-CTA rhythm. Mobile follows the same top-to-compact transition; opening the menu temporarily restores the full-width rail and reveals a 100svh ink canvas with oversized ruled links, availability status and the paper-white contact action pinned to the reading flow. Body scrolling is locked while the menu is open, Escape closes it, and the navbar never displays a logo image.

### Publication Card

File: `src/shared/components/editorial/publication-card.tsx`

Horizontal ruled entry with a square monochrome carousel cover, unit metadata, large title and a square arrow control. Hover recovers contrast and scale but never source color. On small screens the content becomes a single column without changing the visual language.

### Buttons

Primary buttons use paper white with black type. Secondary buttons use black with graphite border. All buttons are rectangular, monospaced and uppercase.

### Site Footer

File: `src/shared/components/layout/site-footer.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Background | Ink `#050505` throughout |
| Border | One-pixel graphite rules separating social and directory cells |
| Border radius | Pill radius only on paired CTA actions |
| Text — primary | Space Grotesk display and paper-white directory copy |
| Text — secondary | Geist Mono in muted gray for metadata |
| Spacing | Large CTA canvas, shell-aligned atmospheric glass band, social rail and compact directory |
| Hover state | Paper-white CTA fill, social arrow shift and white directory links |
| Shadow | A restrained inset highlight and soft black depth only inside the glass band |
| Accent usage | Monochrome throughout the footer; white is the only active signal |

**Pattern notes:**
The footer closes every public route with a project CTA, followed by one restrained monochrome glass band, a four-cell social rail and a four-column directory. Soft white and neutral-gray light fields blur behind the glass while the domain and role stay crisp. The glass, social rail, CTA, directory and legal row all align to the same 86rem `.site-shell`, while only the atmospheric background remains full-bleed. On mobile the glass copy stacks, the social rail becomes 2×2 and the directory collapses progressively to one column.

### Editorial Sections

File: `src/features/home/components/editorial-home.tsx`

Interior pages keep ruled editorial sections. The home is the presentation-led exception: each narrative chapter uses at least `100svh`, alternates ink and paper fields, and carries one dominant idea rather than stacking explanatory copy. White sections remain reserved for evidence and high-contrast pacing.

### Home Hero

File: `src/features/home/components/editorial-home.tsx`
Last updated: 2026-10-13

The opening hero is a full-viewport black field. Andre's real monochrome portrait occupies the right side while the two-line name overlaps it from the left; the outlined surname retypes on a restrained 5.4s loop while the first name remains stable, preserving immediate identity. The 72px engineering grid drifts one cell horizontally every 12s. Fine-pointer movement lights the active glass cell in white and leaves up to nine progressively fading cells behind it, creating a short inspection trail without React re-renders. Both loops pause when the hero leaves the viewport or the document becomes hidden; reduced-motion mode freezes the grid, removes the trail, shows the complete surname and retains only the current hover feedback. After the global route loader exits, the original short mask entrance still reveals the portrait and name, while the bottom metadata rail holds role, location and the scroll action. Mobile keeps the same overlap with a reduced name scale so the surname never clips. The hero contains no descriptive paragraph.

### Home Kinetic Chapters

File: `src/features/home/components/editorial-home.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Background | Alternating `#050505` ink and `#f4f4f0` paper fields |
| Border | Full-width one-pixel rules using line or 20–25% ink |
| Border radius | None, except the navigation contact action |
| Text — primary | Space Grotesk display type, max 6rem, `-0.04em` tracking |
| Text — secondary | Geist Mono for metadata; `text-dim` or 62% ink |
| Spacing | One narrative chapter per `min-height: 100svh` |
| Hover state | Paper-white rules, contrast recovery on grayscale project images and directional icons |
| Shadow | Glass panels use soft black depth and an inset white reflection |
| Accent usage | Paper white for status, moving markers and action rules; ink inversion on light chapters |

**Pattern notes:**
The home uses five full-viewport chapters: identity, practice, selected work, writing and contact. Copy stays factual and compact. Project screenshots are the proof surface; they stay monochrome and recover only contrast and scale on interaction. Technology names and official monochrome service icons run in a continuous offscreen-paused marquee. Icons remain paper white while labels inherit the current field color. Desktop projects use three columns; mobile uses a horizontal snap rail without a visible scrollbar.

### Carousel Viewer

File: `src/shared/components/editorial/carousel-viewer.tsx`

One grayscale 4:5 card is visible at a time inside a ruled technical frame. Previous/next controls stay over the image, while numbered controls and a live counter make position explicit. Keyboard arrows and horizontal touch gestures mirror the visible controls.

### Exercise Workbench

File: `src/shared/components/editorial/exercise-workbench.tsx`

The learning material is organized by exercise rather than by source file. A compact, categorized rail selects one problem at a time; on smaller screens it becomes a bounded scroll area so the active lesson stays close. Each exercise follows the same numbered learning sequence: enunciado, starter, concrete input/output examples, runnable test instructions, progressive hints, and an always-visible resolution area. Resolution access is never hidden behind review, reveal or lock states; the code currently present in the unit is shown directly, with the starter as a safe fallback when an export cannot be parsed. Test examples use ruled two-column rows, commands sit in ink panels with compact copy controls, and full test source stays collapsed until requested. The selected item and progress rule use paper white; reading surfaces remain square, ruled, and matte black.

### Project Case Study

File: `src/app/projects/[slug]/page.tsx`
Last updated: 2026-10-13

| Property | Class |
| --- | --- |
| Background | `bg-ink`, alternating `bg-panel` and `bg-paper` sections |
| Border | `border-line`, one-pixel ruled divisions |
| Border radius | None |
| Text — primary | `text-paper`, `text-ink` on light evidence sections |
| Text — secondary | `text-dim`, `text-ink/65` on light sections |
| Spacing | Section rhythm `py-16 sm:py-24`; internal panels `p-5` to `p-8` |
| Hover state | `text-signal`, screenshot scale `1.018`, signal frame and visible zoom action |
| Shadow | Soft black depth on glass evidence panels only |
| Accent usage | Paper white for numbering, architecture arrows and primary action |

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
| Accent usage | Paper-white location label over the lower-left corner |

**Pattern notes:**
Profile photography remains documentary and monochrome. Use the original portrait without generated effects; the only overlay is a compact factual location label.

### Technology Icon

File: `src/shared/components/editorial/technology-icon.tsx`
Last updated: 2026-10-13

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
Use official monochrome brand marks for named technologies when available. Services without a bundled brand mark, such as AWS and Playwright, use a clear service-specific cloud or testing pictogram; Redis and the remaining named stack keep their official marks. Never introduce brand colors into the portfolio palette. Architecture nodes may show at most two marks when the node intentionally groups tools; chips and stack entries use one mark.

### Site Motion

File: `src/shared/components/motion/site-motion.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Focal entrance | Global pixel `AD` loader, paper-white route scanline and SplitText line masks |
| Route continuity | Native View Transitions; persistent navigation, 180ms exit and 360ms entrance |
| Section reveal | Temporary signal rule, masked heading lines and supporting copy with asymmetric timing |
| List cadence | `0.045s` stagger, capped to visible ScrollTrigger batches |
| Image reveal | Ink overlay retracts with `scaleY`; image settles from `scale: 1.025` |
| Architecture | Ink lane overlay, staggered nodes/arrows and SVG stroke draw-on |
| Scroll depth | Subtle scrubbed depth on technical-grid fields; no persistent page-progress rail |
| Ambient grid | 22s diagonal drift and 16s signal pulse; runs only while the grid intersects the viewport |
| Section scan | One-pixel signal rule grows with scroll progress as each top-level section enters |
| Card scan | A single low-opacity inspection sweep crosses cards on first reveal and is clipped to the card boundary |
| Ambient signals | Signal square pulse, outline breathing and directional architecture arrows run only while visible |
| Interaction | Control shine on hover, directional icon response, nav underline, carousel change, mobile-menu sequence and exercise-panel continuity |
| Performance | Transform, opacity and clip-safe overlays; lazy GSAP loading, batched triggers, intersection-paused loops and scoped cleanup |
| Accessibility | `gsap.matchMedia()` removes spatial motion but retains ≤150ms opacity cues; CSS loops and scans are removed under reduced motion |

**Pattern notes:**
Motion follows the same engineering-notebook metaphor as the visual system: headings are assembled line by line, dark covers retract like inspected panels, architecture paths draw as connections become available, and technical signals show that the system is active. Use GSAP match-media contexts with cleanup for every React-owned animation. Keep routine feedback between 0.12s and 0.38s, authored entrances below 0.75s, and preserve the navigation bar across route transitions. Ambient loops are restricted to the technical grid, signal square, outline heading and architecture connectors; they must remain low contrast, pause offscreen and disappear under reduced motion. Do not add bounce, elastic easing, full-surface bright flashes or animation that changes layout-driving properties.

The home owns a route-specific motion score after the global loader: masked name reveal, portrait wipe, scroll-scrubbed typographic counter-motion and image parallax. Its marquees pause when offscreen or when the document is hidden. Under reduced motion the loader becomes a short opacity acknowledgment, marquees become static and every chapter remains fully visible.

### Route Loader

File: `src/shared/components/motion/route-loader.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Background | Full-viewport ink `#050505` with a faint paper-white system grid |
| Border | None; a 3px white progress rail closes the bottom edge |
| Border radius | None |
| Text — primary | Space Grotesk 650 domain wordmark; `.dev` in paper white |
| Text — secondary | None |
| Spacing | Centered domain wordmark with a two-pixel cursor |
| Hover state | None |
| Shadow | None |
| Accent usage | `.dev`, cursor and progress rail only |

**Pattern notes:**
The loader is mounted by the root template, so it appears on the first visit and every route transition. It types `andredeomondes.dev` in the site's own Space Grotesk voice using a 17-step mask, then exits with a vertical clip in 920ms. It remains decorative and hidden from assistive technology. Reduced-motion mode shows the complete domain immediately and replaces the spatial exit with a 180ms fade.

### Editorial Index Atmosphere

File: `src/shared/components/editorial/editorial-atmosphere.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Background | Generated editorial photography rendered fully in grayscale |
| Border | One-pixel graphite rule at the page-hero boundary |
| Border radius | None |
| Text — primary | Warm paper white; second title line uses a one-pixel outline |
| Text — secondary | Warm white at 70% opacity |
| Spacing | 72–76svh title canvas; grid content keeps the standard site shell |
| Hover state | Project grid glass increases its reflection and ink density |
| Shadow | Soft black depth on glass cards; none on the hero image |
| Accent usage | White scanline and active navigation only |

**Pattern notes:**
Projects and Publications use different generated image assets, but share the same title-canvas anatomy. The raster drifts slowly under a dark veil while visible; the white inspection line crosses occasionally. In content grids the same asset becomes a heavily blurred, low-opacity atmosphere behind readable ink surfaces. Motion pauses offscreen and disappears under reduced-motion preferences.

### Project Intake Form

File: `src/features/contact/components/project-intake-form.tsx`
Last updated: 2026-10-13

| Property | Pattern |
| --- | --- |
| Background | 68% ink glass over the monochrome contact atmosphere |
| Border | One-pixel `#343434` outer and sectional rules |
| Border radius | None for the form; only global navigation actions remain pill-shaped |
| Text — primary | Space Grotesk legends and paper-white field values |
| Text — secondary | Geist Mono uppercase labels; `#9a9a94` supporting copy |
| Spacing | 1.5–2.5rem fieldset padding; 1.2rem field rhythm |
| Hover state | Paper recovery on white next/submit action; white recovery on back action |
| Shadow | Soft downward black depth, no colored halo |
| Accent usage | White progress, focus rule, consent control and primary action |

**Pattern notes:**
The intake is a three-step embedded briefing: contact, project and scope. Every field has a visible label, server-mirrored validation and a nearby recovery message. Step changes move focus to the new legend; validation moves focus to the first invalid control. The final success state stays inside the same surface. Desktop uses a two-column form beside a sticky narrative, tablet and mobile stack it into the reading flow.
