/**
 * I Am Image — full service menu.
 * Copied from her live Square Appointments page on 2026-10-26 (69 listings).
 * `square` keeps her exact Square name so the audit can compare; `name` is the
 * same service lightly tidied for reading (spelling/capitals only — never the
 * price, time or meaning). Prices are her published Square prices; "from"
 * means Square lists it as "Starting at". Final price is confirmed at booking.
 */
export type CategoryKey = "locs" | "braids" | "silk-press" | "color-cuts" | "weaves-wigs" | "texture" | "barber" | "kids" | "consult";
export type PriceType = "fixed" | "from" | "varies" | "consult" | "per";
export type StaffKey = "kayla" | "alcion" | "mia" | "solo";

export type Service = {
  id: string;
  square: string;
  name: string;
  category: CategoryKey;
  price: number | null;
  priceType: PriceType;
  unit?: string;
  minutes: number;
  desc?: string;
  /** Add-on services (Square marks these "add on service"). */
  addOn?: boolean;
  /** Real deposit published on Square (only Mermaid Locs today). */
  deposit?: number;
  popular?: boolean;
  /** Shampoo is NOT included per her Square description. */
  noShampoo?: boolean;
};

export const CATEGORIES: {
  key: CategoryKey;
  label: string;
  short: string;
  slug?: string;
  art: string;
  blurb: string;
}[] = [
  { key: "locs", label: "Locs", short: "Locs", slug: "locs", art: "/media/art/locs.svg", blurb: "Starter locs, retwists, sister locs and small locs, interlocking, detox and repair — plus soft and mermaid locs." },
  { key: "braids", label: "Braids & Twists", short: "Braids", slug: "braids", art: "/media/art/braids.svg", blurb: "Knotless, box, Fulani, boho, stitch and feed-in braids, crochet styles and twists — for women and men." },
  { key: "silk-press", label: "Silk Press & Treatments", short: "Silk Press", slug: "silk-press", art: "/media/art/silkpress.svg", blurb: "Cécred silk presses, ceramic blowouts, keratin strengthening, rice water and protein treatments, sets and up-dos." },
  { key: "color-cuts", label: "Color & Cuts", short: "Color & Cuts", slug: "color-and-cuts", art: "/media/art/pixie.svg", blurb: "All-over color, highlights, ombré and cellophane rinses with precision cuts, pixies, trims and bang trims." },
  { key: "weaves-wigs", label: "Weaves & Wigs", short: "Weaves", slug: "weaves-and-wigs", art: "/media/art/weave.svg", blurb: "Sew-ins with leave out, closure, frontal and 360 installs, quick weaves, ponytails and clip-ins." },
  { key: "texture", label: "Relaxers & Perms", short: "Relaxers", art: "/media/art/silkpress.svg", blurb: "Relaxers, perms, Wave Nouveau and edge touch-ups for smooth, healthy texture changes." },
  { key: "barber", label: "Barber & Men", short: "Barber", slug: "barber", art: "/media/art/barber.svg", blurb: "Fades, line ups, afro cuts, men’s braids and men’s facials." },
  { key: "kids", label: "Kids", short: "Kids", slug: "kids", art: "/media/art/kids.svg", blurb: "Kids box braids (10 and under) and boys cornrows, done with patience." },
  { key: "consult", label: "Consultation & Extras", short: "Extras", art: "/media/art/locs.svg", blurb: "Consultations and add-ons you can attach to any visit." },
];

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<CategoryKey, (typeof CATEGORIES)[number]>;

export const SERVICES: Service[] = [
  // ---------------------------------------------------------------- Locs
  { id: "start-locs", square: "Start locs", name: "Starter Locs", category: "locs", price: 185, priceType: "from", minutes: 90, popular: true },
  { id: "locs", square: "Locs", name: "Loc Maintenance / Retwist", category: "locs", price: 150, priceType: "from", minutes: 180, desc: "Starting price varies on length and grow-out.", popular: true },
  { id: "small-locs", square: "Small locs", name: "Small Locs", category: "locs", price: 1000, priceType: "fixed", minutes: 570 },
  { id: "sister-locs", square: "Sister locs", name: "Sister Locs", category: "locs", price: 1200, priceType: "fixed", minutes: 750 },
  { id: "interlocking", square: "Interlocking", name: "Interlocking", category: "locs", price: 175, priceType: "fixed", minutes: 210 },
  { id: "interlocking-consult", square: "Interlocking", name: "Interlocking (full install)", category: "locs", price: null, priceType: "consult", minutes: 510, desc: "Priced after consulting." },
  { id: "loc-salvation", square: "Loc salvation service and detox with loc reatachment or resizing", name: "Loc Salvation + Detox (re-attachment or resizing)", category: "locs", price: null, priceType: "consult", minutes: 570, desc: "Consultation required." },
  { id: "loc-detox", square: "Loc detox", name: "Loc Detox", category: "locs", price: 60, priceType: "fixed", minutes: 90 },
  { id: "loc-repair", square: "Loc extension repair", name: "Loc Extension Repair", category: "locs", price: 5, priceType: "per", unit: "loc", minutes: 60 },
  { id: "soft-locs", square: "Soft locs", name: "Soft Locs", category: "locs", price: 750, priceType: "fixed", minutes: 510, desc: "Individual plaits set for crochet hair to be added, then hair wrapped from the top to create a seamless look." },
  { id: "mermaid-locs", square: "Mermaid Locs", name: "Mermaid Locs", category: "locs", price: 1000, priceType: "fixed", minutes: 390, deposit: 230, desc: "Hair included — wash and blow dry, individual locs. $230 non-refundable deposit required." },
  { id: "crochet-mermaid-locs", square: "Crochet mermaid locs", name: "Crochet Mermaid Locs", category: "locs", price: 500, priceType: "fixed", minutes: 330, desc: "Hair included: wash & blow dry, crochet-style mermaid locs with individual locs on the perimeter for a seamless finish." },

  // ---------------------------------------------------------------- Braids & twists
  { id: "knotless-braids", square: "Knotless braids", name: "Knotless Braids", category: "braids", price: 350, priceType: "from", minutes: 465, noShampoo: true, desc: "Starting at $350. Shampoo not included — recommended to book separately.", popular: true },
  { id: "bora-bora-knotless", square: "•Bora bora knotless braids", name: "Bora Bora Knotless Braids", category: "braids", price: 375, priceType: "fixed", minutes: 330, popular: true },
  { id: "box-braids", square: "Woman box braids", name: "Box Braids", category: "braids", price: 350, priceType: "from", minutes: 465, noShampoo: true, desc: "Starting at $350. Shampoo not included — recommended to book separately." },
  { id: "box-braids-natural", square: "Box braids on natural hair no hair add", name: "Box Braids on Natural Hair (no hair added)", category: "braids", price: 120, priceType: "from", minutes: 60, noShampoo: true },
  { id: "braid-styles", square: "Woman braids styles", name: "Braid Styles", category: "braids", price: 100, priceType: "from", minutes: 60 },
  { id: "feed-in-cornrows", square: "Feed in cornrows", name: "Feed-In Cornrows", category: "braids", price: 150, priceType: "from", minutes: 120, noShampoo: true },
  { id: "stitch-braids", square: "Stitch braids", name: "Stitch Braids", category: "braids", price: null, priceType: "varies", minutes: 150 },
  { id: "fulani-braids", square: "Fulani braids", name: "Fulani Braids", category: "braids", price: 250, priceType: "fixed", minutes: 210 },
  { id: "boho-braids", square: "Boho braids", name: "Boho Braids", category: "braids", price: 500, priceType: "from", minutes: 270, desc: "Starting at $500." },
  { id: "miracle-knots", square: "Miracle knots", name: "Miracle Knots", category: "braids", price: 250, priceType: "fixed", minutes: 30 },
  { id: "crochet-braids", square: "Crochet braids", name: "Crochet Braids", category: "braids", price: 145, priceType: "from", minutes: 180, noShampoo: true, desc: "What we used to call tree braids — cornrows down as the base, then crocheted in. Shampoo not included." },
  { id: "comb-twist", square: "comb twist", name: "Comb Twist", category: "braids", price: 145, priceType: "from", minutes: 60, desc: "Shampoo included." },
  { id: "two-strand-natural", square: "Two strand twist on natural hair / no extensions add", name: "Two-Strand Twist on Natural Hair", category: "braids", price: 120, priceType: "from", minutes: 90 },
  { id: "flat-twist-out", square: "Two strand flatTwist Outs", name: "Two-Strand Flat Twist-Out", category: "braids", price: 75, priceType: "from", minutes: 90, desc: "Flat twists set under the dryer, then taken out much like a roller set." },
  { id: "men-box-braids", square: "Men box braids", name: "Men’s Box Braids", category: "braids", price: 120, priceType: "from", minutes: 60, noShampoo: true },
  { id: "mens-braids", square: "Mens braids", name: "Men’s Braids", category: "braids", price: 65, priceType: "from", minutes: 90, desc: "Come in shampooed and ready to braid." },

  // ---------------------------------------------------------------- Silk press & treatments
  { id: "silk-press", square: "Ceramic Fusion/ silk press/ blow-out", name: "Ceramic Fusion Silk Press / Blowout", category: "silk-press", price: 65, priceType: "from", minutes: 90, desc: "Shampoo, conditioner, blowout and flat iron with ceramic tools.", popular: true },
  { id: "cecred-silk-press", square: "Beyoncé cecred silk press", name: "Cécred Silk Press", category: "silk-press", price: 100, priceType: "fixed", minutes: 90, desc: "Silk press using Beyoncé’s Cécred hair line. No steam, no deep condition." },
  { id: "cecred-hydration", square: "Beyonce cecred silk press with hydration treatment", name: "Cécred Silk Press + Hydration Treatment", category: "silk-press", price: 150, priceType: "fixed", minutes: 120, desc: "Silk press with Cécred deep conditioner that revitalizes hydration.", popular: true },
  { id: "cecred-reconstruction", square: "Beyoncé cecred silk press with reconstruction treatment masque", name: "Cécred Silk Press + Reconstruction Masque", category: "silk-press", price: 150, priceType: "fixed", minutes: 120 },
  { id: "cecred-rice-water", square: "Beyoncé Cecred rice water treatment", name: "Cécred Rice Water Treatment", category: "silk-press", price: 175, priceType: "fixed", minutes: 120 },
  { id: "strengthening-therapy", square: "Strengthening Therapy Treatment", name: "Strengthening Therapy (Design Essentials Keratin)", category: "silk-press", price: 155, priceType: "from", minutes: 120 },
  { id: "silking", square: "Silking", name: "Silking", category: "silk-press", price: 25, priceType: "from", minutes: 90, desc: "Silking by Design strengthening therapy treatment." },
  { id: "shampoo-steam", square: "Shampoo with steam fusion", name: "Shampoo with Steam Fusion", category: "silk-press", price: 45, priceType: "from", minutes: 60, desc: "Shampoo and conditioning under the steamer — out the door wet and go." },
  { id: "roller-set", square: "Roller Set", name: "Roller Set", category: "silk-press", price: 80, priceType: "from", minutes: 120, desc: "Set on rollers or rods." },
  { id: "up-do", square: "Up-do", name: "Up-Do", category: "silk-press", price: 70, priceType: "from", minutes: 90 },
  { id: "protein-treatment", square: "Protein treatment", name: "Protein Treatment", category: "silk-press", price: 20, priceType: "fixed", minutes: 30, addOn: true, desc: "Add-on service only." },

  // ---------------------------------------------------------------- Color & cuts
  { id: "color", square: "Color", name: "Color", category: "color-cuts", price: 80, priceType: "from", minutes: 120, desc: "Color/dye — comes with flat iron styling, no need to add it.", popular: true },
  { id: "color-highlight", square: "Color And Highlight", name: "Color & Highlight", category: "color-cuts", price: 145, priceType: "from", minutes: 120, desc: "Comes with flat iron styling, no need to add it." },
  { id: "highlight", square: "Highlight", name: "Highlights", category: "color-cuts", price: 100, priceType: "from", minutes: 120, desc: "Highlights / streaks." },
  { id: "ombre", square: "ombre'", name: "Ombré", category: "color-cuts", price: 180, priceType: "from", minutes: 150 },
  { id: "cellophane", square: "Cellophane", name: "Cellophane Color Rinse", category: "color-cuts", price: 80, priceType: "from", minutes: 120, desc: "Color rinse, including ceramic fusion / silk press." },
  { id: "few-foils", square: "Few Foils", name: "Few Foils (7 foils)", category: "color-cuts", price: 35, priceType: "fixed", minutes: 30, addOn: true },
  { id: "one-foil", square: "1 foil hilite", name: "1 Foil Highlight", category: "color-cuts", price: 15, priceType: "from", minutes: 35, addOn: true },
  { id: "extra-color", square: "extra color added w//highlights", name: "Extra Color with Highlights", category: "color-cuts", price: 15, priceType: "from", minutes: 15, addOn: true },
  { id: "shampoo-cut-style", square: "Shampoo Cut /Trim And Style", name: "Shampoo, Cut / Trim & Style", category: "color-cuts", price: 80, priceType: "from", minutes: 120, popular: true },
  { id: "dry-cut", square: "Dry Cut/clipper Cut/shampoo cut only", name: "Dry Cut / Clipper Cut", category: "color-cuts", price: 45, priceType: "from", minutes: 60, desc: "No-shampoo cut or short clipper cut." },
  { id: "bang-trim", square: "bang trim", name: "Bang Trim", category: "color-cuts", price: 15, priceType: "from", minutes: 10, desc: "Bang trim only — no shampoo." },

  // ---------------------------------------------------------------- Weaves & wigs
  { id: "quick-weave", square: "Quick weave", name: "Quick Weave", category: "weaves-wigs", price: 165, priceType: "fixed", minutes: 210, popular: true },
  { id: "quick-weave-ponytail", square: "Quick weave ponytail", name: "Quick Weave Ponytail", category: "weaves-wigs", price: 185, priceType: "fixed", minutes: 210 },
  { id: "fulani-quick-weave", square: "Fulani quick weave", name: "Fulani Quick Weave", category: "weaves-wigs", price: 185, priceType: "fixed", minutes: 270 },
  { id: "partial-weave", square: "Partial Weave", name: "Partial Weave", category: "weaves-wigs", price: 125, priceType: "from", minutes: 180, desc: "Four pieces of extension hair added — shampoo, condition and styling included." },
  { id: "full-weave-leave-out", square: "Full Head Weave with leave out", name: "Full Sew-In with Leave Out", category: "weaves-wigs", price: 200, priceType: "from", minutes: 240, noShampoo: true },
  { id: "full-weave-closure", square: "Full head weave with closure", name: "Full Sew-In with Closure", category: "weaves-wigs", price: 250, priceType: "fixed", minutes: 240 },
  { id: "frontal-install", square: "Full frontal weave installation", name: "Full Frontal Install", category: "weaves-wigs", price: 275, priceType: "from", minutes: 240, noShampoo: true },
  { id: "closure-360", square: "360 closure installation", name: "360 Closure Install", category: "weaves-wigs", price: 375, priceType: "from", minutes: 270, noShampoo: true },
  { id: "weave-works", square: "The weave works", name: "The Weave Works", category: "weaves-wigs", price: 290, priceType: "from", minutes: 330, desc: "Take the weave out, shampoo, condition, and weave it back up." },
  { id: "clip-ins", square: "Clip In Extensions", name: "Clip-In Extensions", category: "weaves-wigs", price: 35, priceType: "from", minutes: 30, addOn: true, desc: "Clip-in wefts only." },
  { id: "take-out", square: "take weave extensions out", name: "Weave / Extension Take-Down", category: "weaves-wigs", price: 55, priceType: "from", minutes: 90, addOn: true, desc: "Take extensions out with an apple cider comb-out (shampoo not included)." },

  // ---------------------------------------------------------------- Relaxers & perms
  { id: "relaxer", square: "Relaxer", name: "Relaxer", category: "texture", price: 100, priceType: "from", minutes: 120, desc: "Chemical relaxer to smooth hair." },
  { id: "perm", square: "Perm", name: "Perm", category: "texture", price: 175, priceType: "from", minutes: 150, desc: "Chemical transformation using rods to curl the hair." },
  { id: "wave-nouveau", square: "Perm/curl", name: "Perm / Curl (Wave Nouveau)", category: "texture", price: 175, priceType: "from", minutes: 120 },
  { id: "walk-around", square: "walk around chemical", name: "Edge Touch-Up (relaxer or color around the hairline)", category: "texture", price: 15, priceType: "from", minutes: 90, addOn: true },

  // ---------------------------------------------------------------- Barber & men
  { id: "fade", square: "Fades", name: "Fade", category: "barber", price: 35, priceType: "fixed", minutes: 30 },
  { id: "fade-line-up", square: "Mens Fades with line up", name: "Fade with Line Up", category: "barber", price: 45, priceType: "fixed", minutes: 30, popular: true },
  { id: "afro-cut", square: "Afro cuts", name: "Afro Cut", category: "barber", price: 45, priceType: "fixed", minutes: 30 },
  { id: "line-up", square: "Line up", name: "Line Up", category: "barber", price: 20, priceType: "fixed", minutes: 30 },
  { id: "men-facial", square: "Men facials", name: "Men’s Facial", category: "barber", price: 60, priceType: "fixed", minutes: 90 },

  // ---------------------------------------------------------------- Kids
  { id: "kids-box-braids", square: "Kids box braids", name: "Kids Box Braids (10 & under)", category: "kids", price: 150, priceType: "fixed", minutes: 210, desc: "Starting at $150 for kids 10 years and under." },
  { id: "boys-cornrows", square: "Boys cornrows", name: "Boys Cornrows", category: "kids", price: 65, priceType: "fixed", minutes: 90 },

  // ---------------------------------------------------------------- Consultation & extras
  { id: "consultation", square: "Consultation", name: "Consultation", category: "consult", price: 50, priceType: "fixed", minutes: 30 },
  { id: "length-charge", square: "Length Charge", name: "Length Charge", category: "consult", price: 25, priceType: "from", minutes: 60, addOn: true, desc: "More hair costs more time, so it’s an added charge (add-on service)." },
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s])) as Record<string, Service>;

/** Which services each stylist offers in the DEMO portal (to confirm with Kayla — ASSETS-OWED.md). */
export const STAFF_CATEGORIES: Record<StaffKey, CategoryKey[]> = {
  kayla: ["silk-press", "color-cuts", "weaves-wigs", "texture", "braids", "consult"],
  alcion: ["locs", "braids", "kids", "silk-press", "color-cuts", "consult"],
  mia: ["weaves-wigs", "braids", "consult"],
  solo: ["barber"],
};

export function servicesIn(cat: CategoryKey) {
  return SERVICES.filter((s) => s.category === cat || (cat === "kids" && (s.id === "kids-box-braids" || s.id === "boys-cornrows")));
}

export function fmtMoney(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

export function fmtPrice(s: Pick<Service, "price" | "priceType" | "unit">) {
  if (s.priceType === "consult") return "After consultation";
  if (s.priceType === "varies" || s.price == null) return "Price varies";
  if (s.priceType === "per") return `${fmtMoney(s.price)} per ${s.unit ?? "item"}`;
  return s.priceType === "from" ? `From ${fmtMoney(s.price)}` : fmtMoney(s.price);
}

export function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/** Lowest published price in a category (for "from" labels on tiles). */
export function fromPrice(cat: CategoryKey) {
  const p = servicesIn(cat)
    .filter((s) => !s.addOn && s.price != null && s.priceType !== "per" && s.minutes >= 30)
    .map((s) => s.price as number);
  return p.length ? Math.min(...p) : null;
}
