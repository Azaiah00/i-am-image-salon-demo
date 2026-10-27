# I Am Image — assets & confirmations still owed by the client

Everything below is either missing, conflicting between her listings, or a **proposal** Couture House made so the demo works. Nothing here is invented on the live pages without a visible marker (“Needs real photo”, “policy to confirm”, “proposed”, “Demo”).

## 1. Facts to confirm (her own listings disagree)

| Item | What we published | Conflict / note |
|---|---|---|
| Hours | Mon, Tue, Thu 10 AM–8 PM · Wed closed · Fri 10 AM–5 PM · Sat 8:30 AM–5 PM · Sun closed (iamimagepdx.com/contact + Square site) | Three listings disagree. **Yelp** shows Mon/Tue/Thu from **1 PM**, Fri & Sat to **6 PM**. **Google** (checked Oct 26 2026) shows Mon–Thu 10 AM–8 PM (**Wed open**), **Fri to 7 PM**, **Sat to 6 PM**, **Sun 11 AM–5:07 PM**. Ask Kayla for her real hours, then make Google, Yelp and the site match. The audit fails the build if the Yelp 1 PM time ever appears. |
| Address | 1500 NW 18th Ave, Suite 104, Portland, OR 97209 — inside ActivSpace on Raleigh | Google writes it “1500 NW 18th PTLD #104”. Same place; we use the standard USPS form. |
| Consultation | Consultation $50 / 30 min (Square) | Her Square bio and Yelp both say **“Free hair consultations are available.”** Which is it? |
| Rating | 5.0 from 37 Google reviews (Oct 26 2026) | Yelp shows 4.5 from 11. Site only cites Google. Update the count in `src/lib/site.ts` as it grows. |
| Stylist spelling | “Alcion” (Square booking page) | A Google review spells it “Alcyion”. Confirm. |
| Miracle Knots | $250 · **30 min** (exactly as on Square) | 30 minutes for a $250 braid style looks like a Square data-entry slip. Confirm the real duration. |
| Kids box braids | $150 (Square price field) | Description says “Starting at $150”. Fixed or from? |
| Bridal | Contact form offers “Bridal / event hair” | Yelp lists bridal services; Square has Up-Do and “Wedding up-do” gallery captions. Confirm she wants bridal inquiries. |
| Award | “Top Hair Salon in Northwest District 2026 — BusinessRate (based on Google reviews)” | From her Instagram post of the award letter. Confirm she’s happy to show it; send the badge file if she wants the badge itself on the site. |

## 2. Photos (biggest upgrade available)

- **Real work photos** — only 7 usable images exist online (Instagram reel covers, 360–480 px, upscaled 2x, never retouched). Needed: **20–40 high-res photos**, ideally 6+ per category: locs, braids, silk press, color & cuts, weaves & wigs, barber, kids. Every gap shows a branded **NEEDS REAL PHOTO** tile on /gallery.
- **Stylist portraits** — Kayla and Alcion use their Square profile selfies (upscaled). Mia and Solo have **no photo** (marked on /team and the home team strip). A 20-minute portrait session in the salon’s red-mirror stations would match the brand perfectly.
- **Salon interior** — one photo (the rack of bundles). Wide shots of the red mirror stations would be ideal for /visit and /about.
- **Logo** — we vectorized her logo from the Square file (`public/media/brand/*.svg`). If she has the original vector, send it and we’ll swap it in.

## 3. Team details

- **Mia** and **Solo**: short bio, specialties and photo (`src/lib/content.ts`, marked NEEDS CLIENT CONFIRMATION on /team).
- **Who offers which services** — the portal’s stylist list per category is a demo mapping based on what her Square page showed (`STAFF_CATEGORIES` in `src/lib/services.ts`). Confirm per stylist.
- Stylist schedules if they differ from salon hours (demo uses salon hours for everyone).

## 4. Policies (not published anywhere yet)

- Deposit rule — **proposed** tiers in the portal: $15 under $100 · $40 for $100–$299 · $75 for $300+. **Real:** Mermaid Locs $230 non-refundable (kept). Editable in Studio → Services & hours.
- Cancellation / no-show / late arrival / rescheduling window.
- Kids & guests in the salon.
- These appear as “policy to confirm” in the booker and on /visit until confirmed.

## 5. Offers & programs (proposals — not yet agreed)

- **Spin the Spiral** popup prizes: $10 off, free protein treatment add-on ($20 value), free bang trim, $15 off braids, free consultation ($50 value), $20 off color. Labeled “Demo offers” in the popup. Kayla picks the real prizes and terms (`src/components/site/SpiralPopup.tsx`).
- **Image Club** loyalty tiers (Member → Silver at 2 visits → Gold at 5 → Platinum at 10) and perks (`tierFor` in `src/lib/portal/db.ts`).
- **Payroll** commission % per stylist (placeholder 60%) in Studio → Team & payroll.

## 6. Content to approve

- The three **Image Journal** articles are drafts written for Kayla’s review (`src/lib/journal.ts`). General hair-care guidance only.
- Landing-page copy (`src/lib/landing.ts`) describes how the team works (“we part clean…”, “we install flat…”). Kayla should read and adjust to her voice.
- Reviews are quoted from Google and her site; a few obvious typos were corrected for reading (“Every knowledgeable” → “Very knowledgeable”, “If your going” → “If you’re going”). Meaning unchanged.
- **Cécred** is Beyoncé’s hair-care brand; her Square menu already names the services after it. Confirm she’s comfortable featuring the name.

## 7. Accounts & launch

- **Domain** — iamimagepdx.com currently points to a Google Sites page. At launch: point it to Netlify, then set `NEXT_PUBLIC_SITE_URL=https://www.iamimagepdx.com` in Netlify (this also turns Google indexing on — the demo is noindex).
- **Booking** — the demo portal is in `BOOKING_MODE = "portal"`. To launch the website before the portal is purchased, set `BOOKING_MODE = "square"` in `src/lib/site.ts`; every Book button then opens her live Square booking page.
- **Netlify Forms** — contact, careers and spin-the-spiral forms. After the first deploy, turn on email notifications to her inbox.
- **Email** — the site shows kaylameans@gmail.com (her published email). A branded address (hello@iamimagepdx.com) would look more premium.
- **Instagram** — links go to @kaylameans (her account that lists I Am Image). If a dedicated salon handle exists, swap it in `src/lib/site.ts`.
- **Google Business Profile** — add the new website URL and the booking link once live.
