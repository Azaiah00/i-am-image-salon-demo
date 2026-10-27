/**
 * Verified business facts for I Am Image Salon (Portland, OR).
 * Sources checked 2026-10-26:
 *  - Square Online site + Square Appointments (i-am-image.square.site, book.squareup.com)
 *  - iamimagepdx.com (Google Sites: home, about, contact)
 *  - Google Business Profile (5.0 from 37 reviews, "Located in: ActivSpace on Raleigh")
 *  - Yelp (claimed, 4.5 from 11 reviews), Intentionalist, Instagram @kaylameans
 * Anything that disagrees between sources is listed in ASSETS-OWED.md.
 */
export const SITE = {
  name: "I Am Image Salon",
  shortName: "I Am Image",
  owner: "Kayla Means",
  tagline: "Elevate your look. Empower your image.",
  /**
   * Address used by share previews, canonical tags and the sitemap. On Netlify this is
   * picked up automatically from the site's primary URL (see next.config.ts). At launch,
   * set NEXT_PUBLIC_SITE_URL=https://www.iamimagepdx.com in Netlify to pin the real domain.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://i-am-image-salon-demo.netlify.app").replace(/\/$/, ""),
  phone: "(503) 224-0399",
  phoneHref: "tel:+15032240399",
  email: "kaylameans@gmail.com",
  address: {
    street: "1500 NW 18th Ave, Suite 104",
    building: "ActivSpace on Raleigh",
    city: "Portland",
    region: "OR",
    zip: "97209",
    neighborhood: "Northwest District",
  },
  geo: { lat: 45.533887, lng: -122.6892909 },
  /** Google Place ID of the salon's Business Profile (verified Oct 26 2026: "I Am Image", 5.0 · 37 reviews). */
  googlePlaceId: "ChIJtzftzfwJlVQR3JGjRKDCz38",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=I+Am+Image+1500+NW+18th+Ave+Suite+104+Portland+OR+97209&destination_place_id=ChIJtzftzfwJlVQR3JGjRKDCz38",
  /** Opens her actual Google Business Profile listing. */
  googleUrl: "https://www.google.com/maps/search/?api=1&query=I+Am+Image+Portland+OR&query_place_id=ChIJtzftzfwJlVQR3JGjRKDCz38",
  /** Opens straight to the Google reviews list for her listing. */
  googleReviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJtzftzfwJlVQR3JGjRKDCz38",
  /** Google Business Profile, Oct 26 2026. */
  rating: { value: 5.0, count: 37 },
  founded: "2011-07-05",
  foundedLabel: "July 5, 2011",
  /** Her live booking today (Square Appointments). */
  squareUrl: "https://book.squareup.com/appointments/5b02c979-e4a1-44ee-b265-3454156b64ce/location/9Q6N5YBHCR6B8/services",
  socials: {
    instagram: "https://www.instagram.com/kaylameans",
    facebook: "https://www.facebook.com/IamImagepdx",
    vimeo: "https://vimeo.com/@Iamimage",
  },
  /**
   * Hours exactly as published on iamimagepdx.com/contact and the Square site.
   * (Yelp shows Mon/Tue/Thu from 1 PM and Fri/Sat to 6 PM — flagged in ASSETS-OWED.md.)
   * Index 0 = Sunday … 6 = Saturday. null = closed.
   */
  hours: [
    { day: "Sunday", open: null, close: null },
    { day: "Monday", open: "10:00", close: "20:00" },
    { day: "Tuesday", open: "10:00", close: "20:00" },
    { day: "Wednesday", open: null, close: null },
    { day: "Thursday", open: "10:00", close: "20:00" },
    { day: "Friday", open: "10:00", close: "17:00" },
    { day: "Saturday", open: "08:30", close: "17:00" },
  ] as { day: string; open: string | null; close: string | null }[],
  /** Her own words (Square Appointments staff bio). */
  story:
    "I am image salon opened July 5, 2011 and was created with a specific goal in mind; to give clients an enjoyable experience in a prime location. While transforming healthy hair one strand at a time.",
  /** Her own words (iamimagepdx.com). */
  whoWeAre:
    "At I Am Image, we provide men, women, and children with a peaceful space and expert guidance for achieving the perfect hairstyle and proper maintenance. More than just a salon, we listen to your unique concerns to craft the best treatment for your hair. We understand that hair care is not one-size-fits-all — what works for one person may not work for another. That's why we personalize every experience, tailoring your hair care to fit your lifestyle and meet your individual needs.",
  /** Square business bio. */
  bio: "I am image salon provides a full range of services for women, men, and children, including hair extensions, coloring, perms, relaxers, precision cuts, taper cuts, up-dos, sets and other texture solutions.",
  /** Square Online checkout methods shown on her booking site. */
  payments: ["Visa", "Mastercard", "American Express", "Discover", "JCB", "Apple Pay", "Google Pay", "Cash App"],
  identities: ["Black-owned", "Woman-owned"],
  /** Instagram post (Sept 2026) — BusinessRate letter, "based on Google reviews". */
  award: "Top Hair Salon in Northwest District for 2026 — BusinessRate (based on Google reviews)",
} as const;

/** True while the site runs on the Netlify demo address (kept out of Google so it never competes with the real domain). */
export const IS_DEMO_HOST = SITE.url.includes("netlify.app");

/**
 * Which booking experience every "Book" button opens.
 * - "portal": the new I Am Image booking portal (/book) — demo mode until launch.
 * - "square": her current live Square Appointments page.
 * Flip to "square" to launch the website before the portal is purchased.
 */
export const BOOKING_MODE: "portal" | "square" = "portal";
export const BOOK_HREF = BOOKING_MODE === "portal" ? "/book" : SITE.squareUrl;
/**
 * Shows the "Demo sign-in" button in the header and mobile menu (opens /portal, where the
 * salon picks Client / Owner / Stylist and the guided walkthrough). Set to false at launch
 * and the button reads "Sign in" instead; it is hidden entirely in "square" mode.
 */
export const PORTAL_DEMO = true;
export const SHOW_PORTAL_LINK = BOOKING_MODE === "portal";
export const bookHref = (serviceId?: string) => (BOOKING_MODE === "portal" ? (serviceId ? `/book?service=${serviceId}` : "/book") : SITE.squareUrl);

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/team", label: "Stylists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
] as const;

/** 12-hour display for an "HH:MM" string. */
export function hm(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`;
}

/**
 * Booking notes taken from her real Square service descriptions. Salon-wide
 * deposit / cancellation / late rules are NOT published anywhere yet — the
 * portal shows proposed defaults marked "proposed" (ASSETS-OWED.md).
 */
export const GOOD_TO_KNOW = [
  {
    title: "Shampoo on braid services",
    body: "Most braid and extension services do not include a shampoo. Come with clean, detangled hair — or add a shampoo to your booking (recommended).",
  },
  {
    title: "Prices start where your hair starts",
    body: "“Starting at” prices are for average length and density. More hair takes more time, so a length charge (from $25) may apply.",
  },
  {
    title: "Mermaid Locs deposit",
    body: "Mermaid Locs (hair included) require a $230 non-refundable deposit to book.",
  },
  {
    title: "Consultation-based services",
    body: "Loc salvation, re-attachment, resizing and some interlocking services are quoted after a consultation so your plan fits your hair.",
  },
  {
    title: "Kids",
    body: "Kids box braids are priced for children 10 years and under. Boys cornrows are available too.",
  },
  {
    title: "Ways to pay",
    body: "Visa, Mastercard, American Express, Discover, JCB, Apple Pay, Google Pay and Cash App.",
  },
] as const;
