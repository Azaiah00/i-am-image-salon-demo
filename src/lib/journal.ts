/**
 * "The Image Journal" — education hub (an upsell surface: blog + newsletter).
 * DRAFTS written by Couture House for Kayla's review before launch
 * (ASSETS-OWED.md). General hair-care guidance only — no medical claims.
 */
export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  art: string;
  minutes: number;
  serviceIds: string[];
  body: { h?: string; p?: string; list?: string[] }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "knotless-vs-box-braids",
    title: "Knotless vs. box braids: which one is right for you?",
    dek: "Same family, different feel. How to choose between the two most-booked braid styles — and how to make either one last.",
    category: "Braids",
    art: "/media/art/braids.svg",
    minutes: 4,
    serviceIds: ["knotless-braids", "bora-bora-knotless", "box-braids", "shampoo-steam"],
    body: [
      { p: "Knotless braids and box braids look alike from across the room, and both are on our menu starting at $350. The difference is how each braid begins at your scalp — and that changes how they feel, how they look as they grow out, and who they suit best." },
      { h: "How they start" },
      { p: "Traditional box braids begin with a small knot of extension hair looped at the root, which gives a crisp, uniform start to every braid. Knotless braids begin with your own hair and feed the extension in gradually, so the root lies flat and blends into your natural hair." },
      { h: "Choose knotless if…" },
      { list: ["You want less tension at the scalp and a lighter feel from day one", "You love a natural-looking root and flexible parts you can style up right away", "Your edges or nape need a gentler approach"] },
      { h: "Choose box braids if…" },
      { list: ["You love that bold, defined, classic look at the root", "You want a slightly fuller braid with crisp structure", "You prefer a style that has held its shape for generations"] },
      { h: "Make them last" },
      { list: ["Arrive with clean, detangled hair — or add a shampoo to your booking (braid services don’t include one)", "Sleep in a satin bonnet or on a satin pillowcase", "Keep your scalp clean and lightly moisturized between washes", "Plan your take-down: leaving any protective style in too long can stress your hair"] },
      { p: "Not sure which one fits your hair, your lifestyle or your schedule? That’s exactly what a consultation is for — we listen first, then plan the style around you." },
    ],
  },
  {
    slug: "make-your-silk-press-last",
    title: "How to make your silk press last (and when to skip one)",
    dek: "A great silk press is about healthy hair first and heat second. Here’s how to keep the swing — and protect your curls.",
    category: "Silk Press",
    art: "/media/art/silkpress.svg",
    minutes: 4,
    serviceIds: ["cecred-hydration", "cecred-silk-press", "silk-press", "protein-treatment"],
    body: [
      { p: "Our silk presses start at $65 for a ceramic fusion press and include Cécred options with hydration or reconstruction treatments. Whichever you choose, the goal is the same: straight, moving, glossy hair that still reverts to healthy curls when you wash it." },
      { h: "Start with healthy hair" },
      { p: "A press only looks as good as the hair underneath it. If your ends feel dry or your hair has been through a lot, pairing your press with a hydration or reconstruction treatment helps it lay smoother and last longer." },
      { h: "Protect it at night" },
      { list: ["Wrap or pin-curl your hair and cover it with a satin scarf or bonnet", "Sleep on a satin pillowcase for extra insurance", "Skip heavy oils at the root — a little goes a long way on the ends"] },
      { h: "Fight the frizz" },
      { list: ["Humidity and sweat are a press’s biggest enemies — keep a scarf handy on rainy Portland days", "Avoid re-applying heat every morning; let your press do the work", "Touch up only the pieces that need it, on low heat"] },
      { h: "When to skip one" },
      { p: "If your hair is breaking, freshly chemically processed or very damaged, talk with your stylist first. Sometimes a treatment visit now makes your next press a lot better." },
    ],
  },
  {
    slug: "starter-locs-first-six-months",
    title: "Starting locs: what your first six months look like",
    dek: "Locs are a journey, not an appointment. Here’s what to expect as your starter locs mature — and how to care for them.",
    category: "Locs",
    art: "/media/art/locs.svg",
    minutes: 5,
    serviceIds: ["start-locs", "locs", "loc-detox", "interlocking"],
    body: [
      { p: "Starter locs at I Am Image begin at $185. Whether you start with comb coils, two-strand twists or interlocking, the first months are when your locs learn their shape — and when patience pays off most." },
      { h: "Months 1–2: the starter stage" },
      { p: "Your locs will look neat and defined but feel soft. They may unravel a little when washed. That’s normal. Keep washes gentle, and avoid over-handling your roots." },
      { h: "Months 3–4: the budding stage" },
      { p: "You may notice small bumps or “buds” forming inside each loc as the hair begins to mat. Your locs can look a little fuzzy — that frizz is part of the process, not a problem." },
      { h: "Months 5–6: shaping up" },
      { p: "Locs begin to firm up, hold their shape and shrink a bit before they start gaining length. Regular maintenance retwists keep your parts clean and your new growth organized." },
      { h: "Care that helps" },
      { list: ["Book maintenance on a steady rhythm so new growth doesn’t matt together", "Use light products — heavy creams and waxes cause build-up", "Ask about a loc detox if your locs feel heavy or dull", "Cover your locs at night with satin to reduce lint and frizz"] },
      { p: "As one client told us after her first locs with Alcion: “I couldn’t be more happier to have her start my journey!” We’d love to start yours." },
    ],
  },
];

export const ARTICLE_BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a])) as Record<string, Article>;
