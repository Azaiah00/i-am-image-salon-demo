# QA report — I Am Image Salon (2026-10-26)

Mandatory post-build audit (website-build-playbook). Production build (`next build`, 32 static routes) served with `next start`.

## Results

| Check | Result |
|---|---|
| `npm run build` | ✅ 0 errors, 32 static routes |
| `npm run lint` (ESLint 9 flat, React Compiler rules) | ✅ clean |
| `npm run typecheck` | ✅ clean |
| `npm run audit:contrast` | ✅ all 17 token pairs pass WCAG AA |
| `npm run audit:flow` | ✅ 28 pages: title, meta description (70–165), exactly one H1, every `<img>` has alt, phone + address on every page, canonical, no emoji, no lorem/TODO/undefined/NaN, no broken internal links, Yelp’s wrong 1 PM hours never shown; **all 74 Square services present with their exact Square names and prices** |
| axe-core (WCAG 2.1 AA) at 390 px and 1440 px | ✅ 0 violations on all 12 public pages **and** all 8 portal screens (client + owner studio) |
| Horizontal overflow at 390 / 768 / 1024 / 1440 | ✅ none on any page |
| Booking flow (Playwright, desktop + phone) | ✅ service → shampoo add-on → stylist → date → time → details → demo deposit → confirmation + .ics; deep links `/book?service=…&stylist=…` |
| Portal flows | ✅ demo sign-in → client (reschedule, cancel, book again, Image Journey, Image Club) · owner (overview, calendar, appointments, clients & journeys incl. adding a journey entry, finances, team & payroll, services & hours editor) · stylist login sees only their own book |
| Spin the Spiral popup | ✅ exit intent / 55% scroll on phones / 35 s; spins, lands on the drawn prize, posts to Netlify Forms |
| Console errors / hydration warnings | ✅ none |
| `prefers-reduced-motion` | ✅ hero shows a static drawing, no autoplay; logo faces render filled; all CSS animation off |

## Lighthouse (mobile, **devtools throttling** — the strict mode; Moto G-class CPU 4× slower, slow 4G)

| Page | Perf | A11y | Best pr. | SEO* | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| / | 92 | 100 | 100 | 69 | 1.9 s | 270 ms | 0 |
| /services | 93 | 100 | 100 | 69 | 1.9 s | 250 ms | 0.001 |
| /services/braids | 95 | 100 | 100 | 69 | 2.0 s | 200 ms | 0.005 |
| /services/silk-press | 93 | 100 | 100 | 69 | 1.9 s | 270 ms | 0.002 |
| /services/locs | 93 | 100 | 100 | 69 | 1.9 s | 250 ms | 0 |
| /team | 95 | 100 | 100 | 69 | 2.2 s | 190 ms | 0 |
| /about | 95 | 100 | 100 | 69 | 1.8 s | 200 ms | 0 |
| /visit | 96 | 100 | 100 | 69 | 1.9 s | 190 ms | 0 |
| /gallery | 95 | 100 | 100 | 69 | 2.0 s | 200 ms | 0 |
| /careers | 95 | 100 | 100 | 69 | 1.8 s | 220 ms | 0 |
| /journal | 94 | 100 | 100 | 69 | 2.1 s | 210 ms | 0.001 |
| /journal/(article) | 96 | 100 | 100 | 69 | 1.7 s | 190 ms | 0 |
| /book | 97 | 100 | 100 | 63 | 1.7 s | 160 ms | 0.001 |
| /portal | 97 | 100 | 100 | 63 | 1.7 s | 170 ms | 0.001 |

Desktop (home): **Performance 100**, LCP 0.8 s, TBT 10 ms, CLS 0.

\* SEO is held down **only** by `is-crawlable`: the netlify.app demo is deliberately `noindex` so it never competes with her real domain. Every other SEO audit passes. Setting `NEXT_PUBLIC_SITE_URL` to her domain at launch turns indexing on (and the portal stays noindex by design).

## What the audit caught and fixed
1. **Hero animation cost 7.4 s of main-thread blocking on a throttled phone** (≈1,700 individually tweened SVG strokes). Fixed by merging strokes into ~10 “bucket” paths per layer (54 animated elements), with each bucket’s dash set to its longest strand so every strand still draws at the same pen speed; the line art now loads after first paint. TBT → ~270 ms.
2. **Font swap re-wrapped headings** (CLS up to 0.27). Fixed with metric-matched Jost fallbacks (Arial via next/font + measured Roboto and DejaVu faces) and `display: optional` on the script accent font. CLS → ~0.
3. **LCP waited for hydration** on /book, /portal, /team and /gallery (entrance animations / reveal classes on above-the-fold content). Fixed: first view renders without entrance animation; first images eager.
4. axe: low-contrast 80% white on crimson (now solid white), unlabeled booker step buttons, `<li>` inside `role="radiogroup"`, a keyboard-unreachable scroll strip. All fixed.
5. Mirror reflection on the closing “I AM IMAGE” headline rebuilt as a CSS pseudo-element (decorative, not read by screen readers).
6. Booker: very long services (Sister Locs 12.5 hr, Small Locs 9.5 hr) start at opening only and are flagged for a second session; demo calendar seeds now leave open days so long braid/loc bookings are possible.

## Still needs the client’s real assets
Hours conflict with Yelp, $50 vs free consultation, Miracle Knots duration, Mia & Solo bios/photos, 20–40 high-res work photos, salon policies (deposit/cancellation), the real Spin-the-Spiral prizes and loyalty rules, domain + Netlify Forms notifications. Full list: **ASSETS-OWED.md**.

---

## Round 2 (2026-10-26): portal demo guide, link previews, responsive sweep

**Added**
- `/portal` is now a perspective picker with demo sign-in: Client, Owner (Kayla) or Stylist (Alcion / Mia / Solo), with demo credentials filled in and a **Guided walkthrough** switch.
- The guided tour (`src/lib/portal/tour.ts`, `src/components/portal/Tour.tsx`) has 12 client, 17 owner and 7 stylist steps. It spotlights the real UI, moves between pages on its own, and every card has a "When it goes live" note.
  - On/off: the **Guide** switch in the red demo bar. **Switch view** returns to the picker.
  - Keyboard: Esc closes, arrow keys move between steps.
  - On phones the card becomes a bottom sheet.
- Link-preview cards (1200×630) for the home page, `/book`, `/portal`, `/services` and all 7 style pages.
  - The preview image address comes from Netlify's `URL` automatically. `NEXT_PUBLIC_SITE_URL` overrides it.
  - Regenerate the cards with `scripts/make-share-cards.py`.

**Responsive sweep:** 28 screens × 12 widths (320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1366, 1440 and 1920 px) = 336 page loads.
- Horizontal overflow: none at any width.
- Fixed for phones:
  - The appointments table and menu editor become stacked cards.
  - Opening-hours rows lay out cleanly.
  - "Swipe sideways" hint on the calendar.
  - Tap targets of 44 px or more for the Confirm buttons, "All →", booking step bars, the phone and email links, and the hours and online checkboxes.
  - Smaller spin wheel on short screens.
  - Demo email and password fields stack on laptop widths.
- axe (WCAG 2.1 AA): 0 violations on the sign-in screen, all three tours (cards open) and the reworked portal screens, at 390 and 1440 px.
- Tours walked start to finish at 1440×900 and 390×844 for each role. Every card stays fully on screen, with no console errors and no overflow.
- `npm run audit` (lint, typecheck, contrast and flow audit): passed.
