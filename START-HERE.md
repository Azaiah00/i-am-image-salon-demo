# START HERE — I Am Image

## 1. Move the repo out of OneDrive first
This folder lives in OneDrive. npm hangs inside OneDrive-synced folders, so copy the whole `i-am-image-site` folder to a local folder first, e.g.
`C:\Users\azaia\Downloads\Real Advancement\Clients\I Am Image\i-am-image-site`

## 2. Run it
```
cd i-am-image-site
npm install
npm run dev        # http://localhost:3000
```
Demo tour: `/` → tap the style chips under the hero → `/services` → `/book` → `/portal`.

### Portal demo (for showing the salon)
`/portal` (the **Demo sign-in** button in the site header and mobile menu) is a **perspective picker + demo sign-in**: choose **Client**, **Owner** or **Stylist** (Alcion / Mia / Solo), the demo email and password are filled in, and the **Guided walkthrough** switch is on by default. After sign-in, step-by-step cards spotlight each feature and explain what it does now and **what it does when it goes live**.
- The red demo bar at the top of every portal page has a **Guide** on/off switch and **Switch view** (back to the picker).
- Esc closes the guide; arrow keys move between steps.
- Tour copy lives in `src/lib/portal/tour.ts`. Spotlight targets are `data-tour="…"` attributes in the portal components.
- The "When it goes live" notes describe what we connect at launch (Stripe deposits, text/email reminders, calendar sync, real logins). Edit any we won't be building before showing the salon.

## 3. Push & deploy (Netlify)
```
git init -b main && git add . && git commit -m "I Am Image site + portal demo"
# repo: https://github.com/Azaiah00/i-am-image-salon-demo
git remote add origin https://github.com/Azaiah00/i-am-image-salon-demo.git
git push -u origin main
```
Netlify → Add new site → import the repo. `netlify.toml` already pins Node 20 and lets `@netlify/plugin-nextjs` handle output (do not set a publish directory).

**Link previews (texting the link):** every page has its own 1200×630 preview card, so a texted, DM'd or posted link shows a branded image card:
| Link | Card |
|---|---|
| `/` and most pages | `public/og.jpg`: Elevate your look. Empower your image. |
| `/book` | `public/og/book.jpg`: Book your next look (booking mock-up) |
| `/portal` (and all portal pages) | `public/og/portal.jpg`: One portal. Three views. |
| `/services` | `public/og/menu.jpg`: the full menu, all 7 categories |
| `/services/locs`, `/braids`, `/silk-press`, `/color-and-cuts`, `/weaves-and-wigs`, `/barber`, `/kids` | `public/og/<slug>.jpg` |

Every preview, canonical tag and the sitemap point to the one address pinned in `netlify.toml`: `NEXT_PUBLIC_SITE_URL = "https://i-am-image-salon-demo.netlify.app"`. A texted link therefore always opens that site and never another Netlify address. At launch, change that one line to her domain (step 4). `robots.txt` lets preview bots in. Google still stays out of the demo through the noindex meta tag. To change a card's wording or price, edit `scripts/make-share-cards.py` and run `python scripts/make-share-cards.py`.
Tip: iMessage caches a link's preview the first time it's sent. Send the link to yourself once after each deploy to check it, before sending it to anyone else.

After the first deploy: Netlify → Forms → turn on email notifications (contact, careers, spin-the-spiral).

## 4. Launch on her domain
1. Point iamimagepdx.com to Netlify.
2. In `netlify.toml` change `NEXT_PUBLIC_SITE_URL` to `https://www.iamimagepdx.com` (this also switches Google indexing on; the netlify.app demo stays noindex).
3. Website before portal? In `src/lib/site.ts` set `BOOKING_MODE = "square"` — every Book button opens her live Square booking page.
4. Work through **ASSETS-OWED.md** (photos, hours conflict, policies, offers).

## 5. Before any handoff
```
npm run build && npm run audit
```
