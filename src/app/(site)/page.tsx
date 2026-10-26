import type { Metadata } from "next";
import Link from "next/link";
import { sharePreview } from "@/lib/og";
import { ArrowRight, Award, CalendarHeart, Clock, HeartHandshake, MapPin, MessageCircle, Phone, Quote, Repeat, Sparkles } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { MirrorFaces } from "@/components/home/MirrorFaces";
import { StyleTiles } from "@/components/ui/StyleTiles";
import { FaqList } from "@/components/ui/FaqList";
import { Accent, Eyebrow, Img, PhotoSlot, SectionTitle, Stars } from "@/components/ui/Kit";
import { InstagramIcon } from "@/components/site/BrandIcons";
import { BOOK_HREF, SITE, bookHref, hm } from "@/lib/site";
import { SERVICES, SERVICE_BY_ID, fmtDuration, fmtPrice } from "@/lib/services";
import { FAQ, REVIEWS, TEAM, WORK } from "@/lib/content";
import { ARTICLES } from "@/lib/journal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  ...sharePreview({
    title: "I Am Image Salon · Elevate your look. Empower your image.",
    description: "Locs, braids, silk press, color & cuts for women, men and kids · NW Portland since 2011 · 5.0★ on Google.",
    path: "/",
    image: "/og.jpg",
    alt: "I Am Image Salon in NW Portland: Elevate your look. Empower your image.",
  }),
};

const PROOF = [
  "5.0 on Google · 37 reviews",
  "Top Hair Salon, NW District 2026 — BusinessRate",
  "Black-owned & woman-owned",
  "Serving Portland since 2011",
  "Women · Men · Children",
  "Locs · Braids · Silk Press · Color · Cuts · Weaves · Fades",
];

const STEPS = [
  { icon: MessageCircle, title: "We listen", body: "Your concerns, your history, your lifestyle. Hair care is not one-size-fits-all — so we start with you, not a template." },
  { icon: Sparkles, title: "We plan", body: "Style, products and timing chosen for your hair type and texture — and an honest price before we begin." },
  { icon: HeartHandshake, title: "We create", body: "Licensed specialists with precision and care. Watch every step in the mirror if you like — many clients do." },
  { icon: Repeat, title: "We maintain", body: "Healthy hair is the long game. You leave knowing how to care for your look until your next visit." },
];

const CECRED = ["cecred-silk-press", "cecred-hydration", "cecred-reconstruction", "cecred-rice-water"];

export default function HomePage() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <>
      <Hero />

      {/* PROOF MARQUEE */}
      <section aria-label="Highlights" className="relative overflow-hidden border-y border-white/[0.07] bg-onyx py-5">
        <div className="flex w-max animate-[marquee_42s_linear_infinite] gap-10 whitespace-nowrap pr-10 motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <ul key={k} className="flex gap-10" aria-hidden={k === 1}>
              {PROOF.map((t) => (
                <li key={t} className="eyebrow flex items-center gap-10 text-mist/80">
                  {t}
                  <span className="size-1.5 rounded-full bg-red" aria-hidden />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* PROBLEM → SOLUTION: THE MIRROR */}
      <section aria-labelledby="mirror-title" className="relative overflow-hidden bg-ink py-24 lg:py-36">
        <div aria-hidden className="absolute -left-40 top-20 size-[36rem] rounded-full bg-crimson/[0.08] blur-3xl" />
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-[25rem]">
            <MirrorFaces className="h-auto w-full" />
            <p className="mt-6 text-center text-xs tracking-[0.3em] text-silver">TWO FACES · ONE IMAGE</p>
          </div>
          <div>
            <SectionTitle
              id="mirror-title"
              eyebrow="Why I Am Image"
              title={
                <>
                  What works for one head of hair may <Accent>not</Accent> work for yours.
                </>
              }
              intro="Look closely at our logo: two faces, turned toward each other, forming the “I.” That’s every appointment here — you and your stylist, face to face. We listen to your unique concerns first, then craft the right treatment for your hair, your texture and your life."
            />
            <ol className="mt-10 grid gap-3 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <li key={s.title} className="reveal card-night p-5" data-delay={i * 80}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-red/10 text-flare">
                      <s.icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="text-xs tracking-[0.3em] text-silver">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl text-bone">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist/80">{s.body}</p>
                </li>
              ))}
            </ol>
            <blockquote className="reveal mt-10 border-l-2 border-red pl-5" data-delay="200">
              <p className="text-xl leading-snug text-bone sm:text-2xl">“I watched the entire process with a mirror, which Kayla suggested I use. I’m very impressed. I feel beautiful!”</p>
              <footer className="mt-3 text-sm text-silver">Debby N. · relaxer, haircut & style · Google review</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* FIND YOUR IMAGE — CATEGORIES */}
      <section aria-labelledby="styles-title" className="relative border-t border-white/[0.05] bg-ink pb-24 lg:pb-32">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 pt-24 lg:flex-row lg:items-end lg:pt-28">
            <SectionTitle
              id="styles-title"
              eyebrow="Find your image"
              title={
                <>
                  One salon for <Accent>every</Accent> look.
                </>
              }
              intro="Women, men and children — natural, relaxed, curly, color-treated, locs and extensions. Pick a style to see real prices and times."
            />
            <Link href="/services" className="btn btn-ghost reveal self-start lg:self-end">
              Full menu & prices <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12">
            <StyleTiles />
          </div>
        </div>
      </section>

      {/* SIGNATURE: CÉCRED SILK PRESS (light section) */}
      <section aria-labelledby="cecred-title" className="relative overflow-hidden bg-bone py-24 text-char lg:py-32">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="reveal relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-char">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img width={600} height={800} src="/media/art/silkpress.svg" alt="" aria-hidden loading="lazy" className="absolute inset-0 m-auto h-[86%] w-auto" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char via-char/80 to-transparent p-6 pt-20">
                <p className="eyebrow text-silver">Signature service</p>
                <p className="display mt-2 text-3xl text-bone">Swing. Shine. Healthy hair underneath.</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionTitle
              tone="light"
              id="cecred-title"
              eyebrow="The Cécred silk press"
              title={
                <>
                  A silk press with a <Accent tone="light">treatment</Accent> built in.
                </>
              }
              intro="We press with Beyoncé’s Cécred hair line — and pair it with hydration or reconstruction so your hair moves, shines and still reverts to healthy curls on wash day."
            />
            <ul className="mt-8 divide-y divide-char/10 border-y border-char/10">
              {CECRED.map((id) => {
                const s = SERVICE_BY_ID[id];
                return (
                  <li key={id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-medium text-char">{s.name}</p>
                      <p className="text-sm text-stone">{fmtDuration(s.minutes)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums text-char">{fmtPrice(s)}</span>
                      <Link href={bookHref(id)} className="grid size-11 place-items-center rounded-full border border-char/15 text-rouge transition hover:border-rouge hover:bg-rouge hover:text-paper" aria-label={`Book ${s.name}`}>
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-sm text-stone">
              Prefer a classic? Ceramic fusion silk press / blowout from $65 ·{" "}
              <Link href="/services/silk-press" className="text-rouge underline-offset-4 hover:underline">
                all silk press & treatments
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* REAL WORK */}
      <section aria-labelledby="work-title" className="relative overflow-hidden bg-ink py-24 lg:py-32">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionTitle
              id="work-title"
              eyebrow="Real clients · real results"
              title={
                <>
                  Come complete your <Accent>image.</Accent>
                </>
              }
              intro="Every photo here is a real I Am Image client, straight from the chair."
            />
            <div className="reveal flex flex-wrap gap-3">
              <Link href="/gallery" className="btn btn-ghost">
                View the gallery <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a href={SITE.socials.instagram} target="_blank" rel="noopener" className="btn btn-ghost">
                <InstagramIcon className="size-4" /> @kaylameans
              </a>
            </div>
          </div>
        </div>
        <ul tabIndex={0} aria-label="Real client work — scroll sideways" className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:px-8 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]">
          {WORK.filter((w) => w.cat !== "salon").map((w, i) => (
            <li key={w.src} className="reveal w-[68vw] shrink-0 snap-start sm:w-[22rem]" data-delay={i * 70}>
              <figure className="group relative overflow-hidden rounded-[var(--radius-card)] bg-onyx">
                <Img src={w.src} alt={w.alt} w={w.w} h={w.h} sizes="(max-width: 640px) 68vw, 22rem" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-14 text-sm text-bone">{w.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* TEAM */}
      <section aria-labelledby="team-title" className="relative border-t border-white/[0.05] bg-onyx py-24 lg:py-32">
        <div className="wrap">
          <SectionTitle
            id="team-title"
            eyebrow="Your stylists"
            title={
              <>
                Licensed specialists. <Accent>Real</Accent> relationships.
              </>
            }
            intro="Clients have stayed with Kayla for ten years and counting. Meet the team behind the chair."
          />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {TEAM.map((t, i) => (
              <li key={t.key} className="reveal" data-delay={i * 70}>
                <Link href={`/team#${t.key}`} className="group block">
                  {t.photo ? (
                    <div className="overflow-hidden rounded-[var(--radius-card)] bg-graphite">
                      <Img src={t.photo} alt={`${t.name}, ${t.role} at I Am Image`} w={1000} h={1333} small={560} sizes="(max-width: 1024px) 50vw, 25vw" className="aspect-[4/5] w-full object-cover grayscale-[0.15] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                    </div>
                  ) : (
                    <PhotoSlot className="aspect-[4/5]" label={`${t.name} — portrait`} art={t.key === "solo" ? "/media/art/barber.svg" : "/media/art/weave.svg"} />
                  )}
                  <p className="mt-4 text-lg text-bone">{t.name}</p>
                  <p className="text-sm text-silver">{t.role}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS */}
      <section aria-labelledby="reviews-title" className="relative overflow-hidden bg-ink py-24 lg:py-32">
        <div aria-hidden className="absolute right-[-12rem] top-0 size-[36rem] rounded-full bg-crimson/[0.09] blur-3xl" />
        <div className="wrap relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Google reviews</Eyebrow>
            <p className="display mt-4 text-[clamp(5rem,14vw,9rem)] leading-none text-bone">5.0</p>
            <Stars className="mt-2" />
            <p className="mt-4 max-w-xs text-mist/85">
              From {SITE.rating.count} reviews on Google — and recognized by BusinessRate as a Top Hair Salon in Portland’s Northwest District for 2026, based on Google reviews.
            </p>
            <a href={SITE.googleUrl} target="_blank" rel="noopener" className="btn btn-ghost mt-6">
              Read them on Google <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {REVIEWS.map((r, i) => (
              <li key={r.name} className={`reveal card-night flex flex-col p-6 ${i % 2 ? "sm:translate-y-8" : ""}`} data-delay={(i % 4) * 70}>
                <Quote className="size-6 text-red" aria-hidden />
                <p className="mt-4 flex-1 leading-relaxed text-mist/90">“{r.text}”</p>
                <p className="mt-5 text-sm text-bone">
                  {r.name} <span className="text-silver">· {r.service}</span>
                </p>
                <p className="text-xs text-silver">
                  {r.source === "Google" ? "Google review" : "Client testimonial"} · with {r.stylist}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STORY + AWARD */}
      <section aria-labelledby="story-title" className="relative overflow-hidden bg-bone py-24 text-char lg:py-32">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionTitle
              tone="light"
              id="story-title"
              eyebrow="Since July 5, 2011"
              title={
                <>
                  Transforming healthy hair, one <Accent tone="light">strand</Accent> at a time.
                </>
              }
              intro="Kayla Means opened I Am Image with a specific goal in mind: to give clients an enjoyable experience in a prime location. Fifteen years later, it’s a full-service, Black-owned, woman-owned salon in Portland’s Northwest District — for women, men and children."
            />
            <div className="reveal mt-8 grid gap-3 sm:grid-cols-3" data-delay="120">
              {[
                { k: "2011", v: "Opened in NW Portland" },
                { k: "5.0", v: `Stars on Google · ${SITE.rating.count} reviews` },
                { k: String(SERVICES.length), v: "Services on the menu" },
              ].map((s) => (
                <div key={s.k} className="card-light p-5">
                  <p className="display text-4xl text-rouge">{s.k}</p>
                  <p className="mt-1 text-sm text-stone">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="180">
              <Link href="/about" className="btn btn-dark">
                Our story <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={BOOK_HREF} className="btn btn-outline-dark">
                <CalendarHeart className="size-4" aria-hidden /> Book with Kayla
              </Link>
            </div>
          </div>
          <div className="reveal relative" data-delay="100">
            <div className="card-light relative overflow-hidden p-8 sm:p-10">
              <Award className="size-10 text-rouge" aria-hidden />
              <p className="eyebrow mt-6 text-stone">BusinessRate · 2026</p>
              <p className="display mt-3 text-[2.4rem] leading-[1.02] text-char">Top Hair Salon in Northwest District</p>
              <p className="mt-4 text-stone">“It is with great pleasure that we recognize your organization for its outstanding achievement as a Top Hair Salon in Northwest District for 2026.”</p>
              <p className="mt-3 text-sm text-stone">Award letter shared by the salon, September 2026 — based on Google reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL — upsell surface */}
      <section aria-labelledby="journal-title" className="relative bg-ink py-24 lg:py-32">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionTitle
              id="journal-title"
              eyebrow="The Image Journal"
              title={
                <>
                  Hair care, <Accent>explained.</Accent>
                </>
              }
              intro="Honest guidance from the chair — so your style lasts longer and your hair stays healthy between visits."
            />
            <Link href="/journal" className="btn btn-ghost reveal self-start lg:self-end">
              All articles <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {ARTICLES.map((a, i) => (
              <li key={a.slug} className="reveal" data-delay={i * 80}>
                <Link href={`/journal/${a.slug}`} className="group card-night flex h-full flex-col overflow-hidden transition hover:border-red/40">
                  <div className="relative h-56 overflow-hidden border-b border-white/[0.06] bg-onyx">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img width={600} height={800} src={a.art} alt="" aria-hidden loading="lazy" className="absolute inset-0 m-auto h-[88%] w-auto transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow text-[0.66rem] text-silver">
                      {a.category} · {a.minutes} min read
                    </p>
                    <h3 className="mt-3 text-xl leading-snug text-bone">{a.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-mist/75">{a.dek}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-flare">
                      Read <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VISIT */}
      <section aria-labelledby="visit-title" className="relative overflow-hidden border-t border-white/[0.05] bg-onyx py-24 lg:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionTitle
              id="visit-title"
              eyebrow="Visit the salon"
              title={
                <>
                  Find us in <Accent>Northwest</Accent> Portland.
                </>
              }
            />
            <div className="reveal mt-8 space-y-5" data-delay="100">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="flex gap-4 text-lg text-bone hover:text-paper">
                <MapPin className="mt-1 size-5 shrink-0 text-flare" aria-hidden />
                <span>
                  {SITE.address.street}
                  <br />
                  {SITE.address.city}, {SITE.address.region} {SITE.address.zip}
                  <span className="block text-sm text-silver">Inside {SITE.address.building}</span>
                </span>
              </a>
              <a href={SITE.phoneHref} className="flex min-h-11 items-center gap-4 text-lg text-bone hover:text-paper">
                <Phone className="size-5 shrink-0 text-flare" aria-hidden /> {SITE.phone}
              </a>
              <div className="flex gap-4">
                <Clock className="mt-1 size-5 shrink-0 text-flare" aria-hidden />
                <dl className="grid flex-1 grid-cols-[6.5rem_1fr] gap-y-1.5 text-mist/90">
                  {order.map((i) => {
                    const h = SITE.hours[i];
                    return (
                      <div key={h.day} className="contents">
                        <dt className="text-silver">{h.day}</dt>
                        <dd>{h.open ? `${hm(h.open)} – ${hm(h.close!)}` : "Closed"}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
            <div className="reveal mt-10 flex flex-wrap gap-3" data-delay="160">
              <Link href={BOOK_HREF} className="btn btn-primary">
                <CalendarHeart className="size-4" aria-hidden /> Book your appointment
              </Link>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="btn btn-ghost">
                Get directions
              </a>
            </div>
          </div>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="reveal group relative block min-h-[22rem] overflow-hidden rounded-[var(--radius-card)] border border-white/[0.08]" data-delay="120" aria-label="Open directions to I Am Image in Google Maps">
            <Img src="/media/work/salon-bundles" alt="Inside I Am Image: styling chairs, red-framed mirrors and a rack of hair bundles" w={958} h={900} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <p className="eyebrow text-silver">Suite 104 · {SITE.address.building}</p>
                <p className="display mt-2 text-3xl text-bone">1500 NW 18th Ave</p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-crimson text-paper transition group-hover:bg-ember">
                <ArrowRight className="size-5 -rotate-45" aria-hidden />
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-ink py-24 lg:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle id="faq-title" eyebrow="Good to know" title={<>Questions, <Accent>answered.</Accent></>} />
          <div className="reveal" data-delay="100">
            <FaqList items={FAQ} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-white/[0.05] bg-ink pb-28 pt-24 text-center lg:pb-36">
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/[0.14] blur-[120px]" />
        <div className="wrap relative">
          <p className="eyebrow text-silver">Your chair is waiting</p>
          <h2 id="cta-title" className="display mt-6 text-[clamp(3.4rem,13vw,10rem)] leading-[0.85] text-bone">
            <span className="mirror" data-reflect="I AM">
              I AM
            </span>{" "}
            <span className="mirror text-red" data-reflect="IMAGE">
              IMAGE
            </span>
          </h2>
          <p className="mx-auto mt-[clamp(2rem,7vw,5.5rem)] max-w-lg text-lg text-mist/90">Book online in under a minute — pick your service, your stylist and your time.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={BOOK_HREF} className="btn btn-primary">
              <CalendarHeart className="size-4" aria-hidden /> Book your appointment
            </Link>
            <a href={SITE.phoneHref} className="btn btn-ghost">
              <Phone className="size-4" aria-hidden /> {SITE.phone}
            </a>
          </div>
          <p className="mt-10 text-sm text-silver">
            Stylists:{" "}
            <Link href="/careers" className="text-mist underline-offset-4 hover:text-paper hover:underline">
              we’re always looking for talent — join our team
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
