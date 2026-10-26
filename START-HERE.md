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
Demo tour: `/` → tap the style chips under the hero → `/services` → `/book` (book a knotless braid with Alcion) → `/portal` → “Continue with Google” → Client, then sign out → Owner — Kayla → Calendar, Clients & journeys, Finances. Try a stylist login too (Alcion / Mia / Solo) — they only see their own book.

## 3. Push & deploy (Netlify)
```
git init && git add . && git commit -m "I Am Image site"
# create the GitHub repo (e.g. i-am-image-salon), then:
git remote add origin https://github.com/<you>/i-am-image-salon.git
git push -u origin main
```
Netlify → Add new site → import the repo. `netlify.toml` already pins Node 20 and lets `@netlify/plugin-nextjs` handle output (do not set a publish directory). Suggested site name: **i-am-image-salon** → https://i-am-image-salon.netlify.app (the URL `src/lib/site.ts` already uses for share previews). If you pick another name, set `NEXT_PUBLIC_SITE_URL` in Netlify → Environment variables.

After the first deploy: Netlify → Forms → turn on email notifications (contact, careers, spin-the-spiral).

## 4. Launch on her domain
1. Point iamimagepdx.com to Netlify.
2. Set `NEXT_PUBLIC_SITE_URL=https://www.iamimagepdx.com` (this also switches Google indexing on — the netlify.app demo stays noindex).
3. Website before portal? In `src/lib/site.ts` set `BOOKING_MODE = "square"` — every Book button opens her live Square booking page.
4. Work through **ASSETS-OWED.md** (photos, hours conflict, policies, offers).

## 5. Before any handoff
```
npm run build && npm run audit
```
