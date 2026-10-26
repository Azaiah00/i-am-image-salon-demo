import type { CategoryKey } from "@/lib/services";

/** Copy for each service landing page (/services/[slug]). Facts come from her real menu. */
export const LANDING: Record<
  string,
  {
    key: CategoryKey;
    metaTitle: string;
    metaDesc: string;
    eyebrow: string;
    h1: [string, string, string?];
    intro: string;
    problem: string;
    points: string[];
    reviewName?: string;
    quote?: { text: string; by: string };
    photos: string[];
    stylists: string[];
    featured: string[];
  }
> = {
  locs: {
    key: "locs",
    metaTitle: "Locs in Portland — Starter Locs, Retwists & Repair",
    metaDesc: "Starter locs from $185, retwists from $150, interlocking, loc detox, repair, soft & mermaid locs at I Am Image in NW Portland. 5.0★ on Google.",
    eyebrow: "Locs · NW Portland",
    h1: ["Your loc journey,", "started", "right."],
    intro: "Starter locs, maintenance retwists, interlocking, detox and repair — plus soft locs and mermaid locs — from stylists who treat locs as a journey, not a single appointment.",
    problem: "Overdue new growth, thinning roots or locs that never quite “took”? Loc salvation, re-attachment and resizing are planned after a consultation, so the fix fits your locs.",
    points: ["Starter locs from $185", "Retwist / maintenance from $150", "Loc detox $60", "Extension repair $5 per loc", "Salvation & resizing by consultation"],
    reviewName: "Maxx M.",
    photos: [],
    stylists: ["alcion"],
    featured: ["start-locs", "locs", "interlocking", "loc-detox"],
  },
  braids: {
    key: "braids",
    metaTitle: "Knotless & Box Braids in Portland, OR",
    metaDesc: "Knotless braids from $350, Bora Bora knotless $375, box, Fulani, boho, stitch & feed-in braids, twists and crochet at I Am Image, NW Portland.",
    eyebrow: "Braids & twists · NW Portland",
    h1: ["Braids that", "last", "— and protect."],
    intro: "Knotless, Bora Bora knotless, box, Fulani, boho, stitch and feed-in braids, crochet styles, comb twists and two-strand twists — for women, men and kids.",
    problem: "Tension headaches, thinning edges and braids that frizz in a week usually come down to rushed parting and too much pull. We part clean, braid with care and tell you how to make it last.",
    points: ["Knotless & box braids from $350", "Bora Bora knotless $375", "Fulani braids $250", "Feed-in cornrows from $150", "Men’s braids from $65"],
    quote: { text: "A true expert in braiding, she specializes in locs and a wide variety of protective styles that promote hair growth. She’s also fantastic with children and impressively quick without sacrificing quality.", by: "On Alcion — from her I Am Image booking profile" },
    photos: ["/media/work/knotless-back", "/media/work/braiding-process"],
    stylists: ["alcion", "mia", "kayla"],
    featured: ["knotless-braids", "bora-bora-knotless", "fulani-braids", "feed-in-cornrows"],
  },
  "silk-press": {
    key: "silk-press",
    metaTitle: "Silk Press in Portland — Cécred Silk Press & Blowouts",
    metaDesc: "Cécred silk press from $100, with hydration or reconstruction $150, ceramic fusion silk press from $65, keratin, rice water & protein treatments in NW Portland.",
    eyebrow: "Silk press & treatments · NW Portland",
    h1: ["Silk that", "swings", "— and stays healthy."],
    intro: "Cécred silk presses, ceramic fusion blowouts, Design Essentials keratin strengthening, rice water and protein treatments, roller sets and up-dos.",
    problem: "A press should never cost you your curls. We start with healthy hair, pair your press with the right treatment, and use heat with precision — so you leave with movement and shine, and revert on wash day.",
    points: ["Ceramic fusion silk press from $65", "Cécred silk press $100", "Cécred + hydration or reconstruction $150", "Strengthening therapy from $155", "Protein treatment add-on $20"],
    reviewName: "Simone F.",
    photos: [],
    stylists: ["kayla", "alcion"],
    featured: ["silk-press", "cecred-silk-press", "cecred-hydration", "strengthening-therapy"],
  },
  "color-and-cuts": {
    key: "color-cuts",
    metaTitle: "Hair Color & Cuts in Portland — Pixies & Highlights",
    metaDesc: "Color from $80, color & highlight from $145, ombré, cellophane, precision cuts, pixies and trims for natural and relaxed hair at I Am Image, NW Portland.",
    eyebrow: "Color & cuts · NW Portland",
    h1: ["Color that", "pops.", "Cuts that hold."],
    intro: "All-over color, highlights, ombré and cellophane rinses, with precision cuts, pixies, trims and bang trims — color services include flat-iron styling.",
    problem: "Finding a colorist you trust with thick, textured hair is hard. Our clients say this is “the only hair salon I would trust to do color on my thick black head of hair.”",
    points: ["Color from $80 (styling included)", "Color & highlight from $145", "Ombré from $180", "Shampoo, cut / trim & style from $80", "Bang trim from $15"],
    reviewName: "Ariana A.",
    photos: ["/media/work/red-pixie-smile", "/media/work/pixie-color"],
    stylists: ["kayla"],
    featured: ["color", "color-highlight", "ombre", "shampoo-cut-style"],
  },
  "weaves-and-wigs": {
    key: "weaves-wigs",
    metaTitle: "Sew-Ins, Quick Weaves & Wig Installs in Portland",
    metaDesc: "Quick weave $165, sew-in with leave out from $200, closure $250, frontal from $275, 360 closure from $375 and clip-ins at I Am Image, NW Portland.",
    eyebrow: "Weaves & wigs · NW Portland",
    h1: ["Installs so", "seamless", "they’re yours."],
    intro: "Quick weaves and ponytails, partial weaves, full sew-ins with leave out, closure, frontal and 360 installs, The Weave Works and clip-ins.",
    problem: "Visible tracks, lumpy closures and leave out that won’t blend are what people notice. We install flat, blend carefully and protect the hair underneath.",
    points: ["Quick weave $165", "Full sew-in with leave out from $200", "Closure sew-in $250", "Frontal install from $275", "360 closure from $375"],
    reviewName: "Natisha P.",
    photos: ["/media/work/wig-install", "/media/work/curls-red-dress"],
    stylists: ["kayla", "mia"],
    featured: ["quick-weave", "full-weave-leave-out", "full-weave-closure", "frontal-install"],
  },
  barber: {
    key: "barber",
    metaTitle: "Barber in NW Portland — Fades, Line Ups & Facials",
    metaDesc: "Fades $35, fade with line up $45, afro cuts $45, line ups $20 and men’s facials $60 at I Am Image in Portland’s Northwest District.",
    eyebrow: "Barber & men · NW Portland",
    h1: ["Sharp lines.", "Clean", "fades."],
    intro: "Fades, fades with line up, afro cuts, line ups and men’s facials — plus men’s braids and box braids.",
    problem: "A great fade is about consistency. Book your barber, keep your rhythm, and stay sharp between events.",
    points: ["Fade $35", "Fade with line up $45", "Afro cut $45", "Line up $20", "Men’s facial $60"],
    photos: [],
    stylists: ["solo"],
    featured: ["fade-line-up", "fade", "afro-cut", "men-facial"],
  },
  kids: {
    key: "kids",
    metaTitle: "Kids’ Braids & Boys Cornrows in Portland",
    metaDesc: "Kids box braids from $150 (10 & under) and boys cornrows $65 at I Am Image in NW Portland — patient, gentle stylists who are great with children.",
    eyebrow: "Kids · NW Portland",
    h1: ["Little crowns,", "gentle", "hands."],
    intro: "Kids box braids for children 10 and under, and boys cornrows — done with patience, gentle tension and plenty of encouragement.",
    problem: "Long sits are hard for little ones. Alcion is known for being fantastic with children and impressively quick without sacrificing quality.",
    points: ["Kids box braids $150 (10 & under)", "Boys cornrows $65", "Gentle tension, clean parts", "Good for kids — Google highlight"],
    photos: [],
    stylists: ["alcion"],
    featured: ["kids-box-braids", "boys-cornrows"],
  },
};
