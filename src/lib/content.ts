import type { StaffKey } from "@/lib/services";

/**
 * REAL reviews only — copied verbatim (trimmed with … where long) from Google
 * Business Profile and the testimonials on iamimagepdx.com, 2026-10-26.
 * Third-party reviews are shown as quotes; they are NOT marked up as the
 * business's own Review schema.
 */
export const REVIEWS = [
  {
    name: "Debby N.",
    source: "Google",
    service: "Relaxer, haircut & style",
    stylist: "Kayla",
    text: "She made me feel comfortable when I walked in and listened carefully to what I wanted. I needed a relaxer, haircut, and style. I watched the entire process with a mirror, which Kayla suggested I use. … My hair has never looked or felt better! I’ve received so many compliments!",
  },
  {
    name: "Ariana A.",
    source: "Google",
    service: "Color & silk press",
    stylist: "Kayla",
    text: "Got my hair colored and silk pressed here and I am IN LOVE! This is the ONLY hair salon I would trust to do color on my thick black head of hair. … My stylist Kayla was able to make so many colors pop off. I’m amazed — never been happier with my hair!",
  },
  {
    name: "Isis",
    source: "Google",
    service: "Big chop, cut & color",
    stylist: "Kayla",
    text: "Kayla is fantastic. A true hairstylist for Black hair. She’s knowledgeable, experienced, professional (and fun!), and patient. I went in to cut off all of my hair for the first time in my life and she took the time to walk me through the process and coach me on my hair.",
  },
  {
    name: "Maxx M.",
    source: "Google",
    service: "Starter locs",
    stylist: "Alcion",
    text: "Alcyion was super kind and she did exactly what I wanted without having to say much. We connected quick. She’s really sweet n worked hard on my first locks. I couldn’t be more happier to have her start my journey! She was informative.",
  },
  {
    name: "Beth O.",
    source: "Google",
    service: "Curl restoration",
    stylist: "Kayla",
    text: "I love Kayla and don’t know how I ever managed before I found her. She rescued my hair and restored my curls. Now I can actually wear my hair curly or straight because it’s so healthy. … Go see her and change your life!",
  },
  {
    name: "Fatima H.",
    source: "iamimagepdx.com",
    service: "Client for 10 years",
    stylist: "Kayla",
    text: "I love this place and Kayla, she’s been my stylist since I moved to Oregon 10 years ago. Very knowledgeable on all hair types and products and she is a professional in her trade and dealings with customers. I highly recommend.",
  },
  {
    name: "Simone F.",
    source: "iamimagepdx.com",
    service: "Blowout",
    stylist: "Kayla",
    text: "Kayla is absolutely amazing! She did a blowout to my hair and it had to be the best I’ve ever had! She’s got a refreshing personality and just has awesome energy! Will be coming back for sure.",
  },
  {
    name: "Natisha P.",
    source: "iamimagepdx.com",
    service: "Loyal client",
    stylist: "Kayla",
    text: "If you’re going to other salons stop now. I Am Image is the place to be. Kayla is amazing and the only one I will allow to touch my hair. She is a master by far at hair!!",
  },
] as const;

export type Stylist = {
  key: StaffKey;
  name: string;
  role: string;
  photo?: string;
  specialties: string[];
  bio: string;
  /** Bio source / confirmation status. */
  bioNote?: string;
};

export const TEAM: Stylist[] = [
  {
    key: "kayla",
    name: "Kayla Means",
    role: "Owner · Master Stylist",
    photo: "/media/team/kayla",
    specialties: ["Color & highlights", "Precision cuts & pixies", "Silk press", "Sew-ins & extensions", "Relaxers & perms", "Keratin treatments"],
    bio: "Kayla opened I Am Image on July 5, 2011 with a specific goal: give clients an enjoyable experience in a prime location — while transforming healthy hair one strand at a time. With decades of experience, she specializes in everything from precision cuts and creative color to extensions, relaxers, perms, protective styles and keratin treatments.",
    bioNote: "From her Square bio and iamimagepdx.com/about.",
  },
  {
    key: "alcion",
    name: "Alcion",
    role: "Stylist · Locs & Braids",
    photo: "/media/team/alcion",
    specialties: ["Starter locs & retwists", "Knotless & box braids", "Protective styles", "Kids’ styles"],
    bio: "A true expert in braiding, Alcion specializes in locs and a wide variety of protective styles that promote hair growth. She’s fantastic with children and impressively quick without sacrificing quality.",
    bioNote: "From her Square Appointments profile.",
  },
  {
    key: "mia",
    name: "Mia",
    role: "Stylist · Weaves & Braids",
    specialties: ["Quick weaves", "Bora Bora knotless", "Sew-ins"],
    bio: "Mia takes appointments for quick weaves and Bora Bora knotless braids on the I Am Image booking page.",
    bioNote: "NEEDS CLIENT CONFIRMATION — bio, photo and full specialties.",
  },
  {
    key: "solo",
    name: "Solo",
    role: "Barber",
    specialties: ["Fades & line ups", "Afro cuts", "Men’s facials"],
    bio: "Solo is the I Am Image barber for fades, line ups, afro cuts and men’s facials.",
    bioNote: "NEEDS CLIENT CONFIRMATION — bio and photo.",
  },
];

export const TEAM_BY_KEY = Object.fromEntries(TEAM.map((t) => [t.key, t])) as Record<StaffKey, Stylist>;

/** Real client work, from Instagram @kaylameans (upscaled 2x, never retouched). */
export const WORK = [
  { src: "/media/work/red-pixie-smile", alt: "Smiling client with a short copper-red pixie cut in the I Am Image salon, red mirror frames behind her", label: "Color & pixie cut", cat: "color-cuts", w: 720, h: 1280 },
  { src: "/media/work/knotless-back", alt: "Back view of long, neat knotless braids with clean square parts", label: "Knotless braids", cat: "braids", w: 720, h: 940 },
  { src: "/media/work/pixie-color", alt: "Client in profile with a tapered pixie cut and honey-blonde highlights", label: "Pixie cut & highlights", cat: "color-cuts", w: 720, h: 1280 },
  { src: "/media/work/braiding-process", alt: "An I Am Image stylist braiding a client’s feed-in cornrows by the salon window", label: "Feed-in cornrows in progress", cat: "braids", w: 720, h: 1280 },
  { src: "/media/work/curls-red-dress", alt: "Client with long glossy curls and side-swept braids in a burgundy dress", label: "Curls & side braids", cat: "weaves-wigs", w: 960, h: 674 },
  { src: "/media/work/wig-install", alt: "Client with a sleek, bone-straight middle-part wig install", label: "Wig install", cat: "weaves-wigs", w: 720, h: 530 },
  { src: "/media/work/salon-bundles", alt: "Inside I Am Image: a stylist with a rack of hair bundles beside the styling chairs", label: "Inside the salon", cat: "salon", w: 958, h: 900 },
] as const;

export const FAQ = [
  {
    q: "Do you work with all hair types?",
    a: "Yes. I Am Image serves women, men and children of every hair type and texture — natural, relaxed, curly, color-treated, locs and extensions. Kayla’s clients describe her as “knowledgeable on all hair types and products.”",
  },
  {
    q: "Is shampoo included with braids and weaves?",
    a: "Not on most braid and extension services. Come with clean, detangled hair, or add a shampoo to your booking — it’s recommended. Comb twists and partial weaves include shampoo.",
  },
  {
    q: "Why are some prices “starting at”?",
    a: "Your price depends on length, density and the style you choose. More hair takes more time, so a length charge (from $25) can apply. Your stylist confirms the final price before starting.",
  },
  {
    q: "Do you offer consultations?",
    a: "Yes — book a consultation online. Loc salvation, re-attachment, resizing and full interlocking installs are priced after a consultation so the plan fits your hair.",
  },
  {
    q: "Do you take kids?",
    a: "Yes. Kids box braids are priced for children 10 and under, boys cornrows are on the menu, and Alcion is known for being fantastic with children.",
  },
  {
    q: "Where do I park and how do I find you?",
    a: "We’re in Suite 104 of ActivSpace on Raleigh, 1500 NW 18th Ave in Portland’s Northwest District (97209). Tap “Get directions” for turn-by-turn.",
  },
  {
    q: "What forms of payment do you accept?",
    a: "Visa, Mastercard, American Express, Discover, JCB, Apple Pay, Google Pay and Cash App.",
  },
  {
    q: "Are you hiring?",
    a: "We’re always looking for talented, dedicated stylists. Visit the Join Our Team page to apply.",
  },
] as const;
