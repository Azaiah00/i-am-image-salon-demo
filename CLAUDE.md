# CLAUDE.md — working in this repo

I Am Image Salon (Portland, OR) — marketing site + demo booking portal (client side, owner studio, stylist studio). Built by Couture House Co.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 (CSS-first `@theme` in `src/app/globals.css`) · GSAP + ScrollTrigger · Lenis · Framer Motion (portal only) · Lucide icons. Fonts self-hosted via `next/font/local`.

## Commands
```
npm install
npm run dev            # http://localhost:3000
npm run build          # must pass with zero errors
npm run lint           # ESLint 9 flat config — must be clean
npm run typecheck
npm run audit:contrast # token contrast pairs (WCAG AA)
npm run audit:flow     # run AFTER build: titles, descriptions, one H1, alts, NAP, emoji, placeholders, links, full Square menu + prices
npm run audit          # lint + typecheck + contrast + flow
```

## Map
- `src/app/(site)/*` — public site: home, services, services/[slug] (7 landing pages), team, gallery, about, visit, careers, journal, journal/[slug].
- `src/app/(portal)/book` — 5-step booker. `/portal` demo sign-in → `/portal/client` (client) or `/portal/studio/*` (owner: overview, calendar, appointments, clients & journeys, finances, team & payroll, services & hours; stylists see only their own overview/calendar/appointments/clients).
- `src/lib/site.ts` — verified facts, hours, `BOOKING_MODE` switch ("portal" | "square").
- `src/lib/services.ts` — her real Square menu (74 items; `square` = exact Square name).
- `src/lib/content.ts` — real reviews, team, real work photos, FAQ. `landing.ts` — landing copy. `journal.ts` — article drafts.
- `src/lib/brand.ts` — traced logo paths (vase, IMAGE, spiral centerline).
- `src/lib/portal/db.ts` — **the only data layer for the portal** (in-memory demo store, fictional clients).
- `public/media/hero/lines.json` — hero line art (base + 4 hairstyles, bucketed paths). `public/media/art/*.svg` — category line art.
- `scripts/square-menu-2026-10-26.txt` — Square menu snapshot the flow audit checks against.

## Rules
- Follow DESIGN.md: only `@theme` tokens; `.display` headings; one `<Accent>` script word per heading; `flare` for red text on dark, `rouge` on light, `red` never for small text.
- Never invent business facts. Prices/hours change only in `src/lib/*.ts`. Anything unconfirmed goes in ASSETS-OWED.md with a visible marker on the page.
- Portal UI goes through `lib/portal/db.ts`. `useDB(selector)` must return existing state slices (derive with `useMemo`). No `Date.now()` in render — use `useNow()`.
- Keep the demo honest: “Demo” labels on sign-in, payments, rewards, offers. No real card fields.
- Every animation honors `prefers-reduced-motion`. Keep Lighthouse ≥ 90 (mobile, devtools throttling) — current 92–96.
- Never install node_modules inside a OneDrive-synced folder (npm hangs). Copy the repo to a local folder first.
- Going live: replace `db.ts` internals with Supabase (`// TODO: Supabase`), `demoCharge()` with Stripe or Square (`// TODO: Stripe`), add real auth. The UI does not change.
