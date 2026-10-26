# DESIGN.md — I Am Image Salon

**Direction: “The Mirror.”** Her logo is a Rubin vase — two faces turned toward each other that also form the letter **I**, a red spiral above, and the word *Salon* mirrored underneath like a reflection. The site is built from those three ideas: **two faces** (you and your stylist, face to face), the **spiral** (the image taking shape), and the **reflection**. Black and logo red, nothing else loud. Restraint, big geometric type, one script accent per heading.

## Color tokens (`src/app/globals.css` → `@theme`)
Sampled from her logo file: red = **#F92505** (249, 37, 5), black, and the logo’s silver ground (#9B9CA0).

| Token | Hex | Use |
|---|---|---|
| `ink` | #0B0A0A | page background |
| `onyx` | #131111 | alternate dark sections, footer |
| `graphite` | #1C1919 | cards |
| `smoke` | #2A2626 | hairlines |
| `red` | #F92505 | logo red — line art, large display, decoration only |
| `flare` | #FF4A3D | red **text** on dark (5.9:1 on ink) |
| `crimson` | #C8140E | primary button fill (white text 5.9:1) |
| `ember` | #E01C0D | button hover (white 4.84:1) |
| `rouge` | #B5120D | red text on light (6.1:1 on bone) |
| `silver` | #A3A3A8 | muted text on dark (7.9:1 on ink) |
| `mist` | #D9D7D5 | body text on dark |
| `bone` | #F4F1EE | headings on dark, light sections |
| `paper` | #FFFFFF | white |
| `char` | #1A1717 | text on light |
| `stone` | #5C5A5A | muted text on light (6.1:1 on bone) |

Every pair is measured by `npm run audit:contrast` (all pass WCAG AA). `red` is never used for small text.

## Type
- **Jost** (variable, self-hosted) — display and UI. Geometric like the logo’s “I AM IMAGE”. Display: weight 400, tracking −0.025em, leading 0.96. Eyebrows: 0.74rem, 0.34em tracking, uppercase.
- **Pinyon Script** — the logo’s “Salon” script. **One accent word per heading** via `<Accent>` (logo red). `display: optional` so a late font never re-wraps a heading.
- Fonts live in `src/app/fonts/` and load through `next/font/local`.

## Layout
`.wrap` max 1240px, 20px gutter (32px ≥768). Sections 96–144px vertical. Cards radius 20px; buttons pill. Tap targets ≥44px. Mobile first; a thumb-zone Book bar appears on phones after the hero.

## Signature motion (all honor `prefers-reduced-motion`)
1. **Hero — “One woman. Every image.”** One line-art woman (generated on Kie.ai Nano Banana Pro, then traced to SVG centerlines). Her face/shoulders are drawn once in bone; only her **hair** redraws in logo red, cycling **locs → knotless braids → silk press → color & cut** (the four styles I Am Image is known for). Each change: the logo spiral above her turns like a thought, a mirror glint sweeps across, old hair retracts, new hair draws. Visitors can tap a style chip to change it. Autoplay pauses off-screen. Strokes are pre-merged into ~10 “bucket” paths per layer (54 animated elements total) so the animation costs ~200 ms TBT on a throttled phone.
2. **The two faces** (home + about) — the logo’s Rubin vase outline **draws itself as you scroll** (GSAP ScrollTrigger scrub), then fills in bone with the red IMAGE letters: the visitor literally draws the logo.
3. **Style tiles & page heroes** — each category has its own line-art portrait (locs, braids, silk press, pixie, weave, barber, kids) that draws on as it loads (CSS inside each SVG file).
4. **Reflection** — the final “I AM IMAGE” headline has a mirrored reflection (CSS pseudo-element), echoing the mirrored “Salon”.
5. Lenis smooth scroll synced to GSAP; fade/rise reveals; marquee proof bar.

## Photography
Real client work only (`public/media/work`) — her Instagram reel covers, cropped to remove overlay text, upscaled 2x (Recraft crisp upscale on Kie.ai), never retouched. Missing categories show a branded **NEEDS REAL PHOTO** tile. Line art carries the luxury look where photos are thin.

## Scrollbars
Logo-red gradient thumb on an onyx track (`.light-scroll` variant on light sections). Never default grey.

## Gamified capture
**Spin the Spiral** — the agency spin-the-wheel mechanic, re-skinned with the logo spiral at the hub. Exit intent on desktop, 55% scroll on phones, or 35 s. Once per visit. Prizes are proposals (ASSETS-OWED.md).
