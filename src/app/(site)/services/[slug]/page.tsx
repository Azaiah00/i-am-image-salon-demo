import type { Metadata } from "next";
import { sharePreview } from "@/lib/og";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarHeart, Check, Clock, Quote } from "lucide-react";
import { Accent, Eyebrow, Img, SectionTitle } from "@/components/ui/Kit";
import { LANDING } from "@/lib/landing";
import { CATEGORY_BY_KEY, SERVICE_BY_ID, fmtDuration, fmtPrice, servicesIn } from "@/lib/services";
import { REVIEWS, TEAM_BY_KEY, WORK } from "@/lib/content";
import { SITE, bookHref } from "@/lib/site";
import type { StaffKey } from "@/lib/services";

export function generateStaticParams() {
  return Object.keys(LANDING).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = LANDING[slug];
  if (!l) return {};
  return {
    title: l.metaTitle,
    description: l.metaDesc,
    alternates: { canonical: `/services/${slug}` },
    ...sharePreview({ title: `${l.metaTitle} · I Am Image Salon`, description: l.metaDesc, path: `/services/${slug}`, image: `/og/${slug}.jpg`, alt: `${l.metaTitle} at I Am Image Salon, NW Portland` }),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = LANDING[slug];
  if (!l) notFound();
  const cat = CATEGORY_BY_KEY[l.key];
  const all = servicesIn(l.key);
  const r0 = REVIEWS.find((r) => r.name === l.reviewName);
  const review = r0 ? { text: r0.text, by: `${r0.name} · ${r0.service} · ${r0.source === "Google" ? "Google review" : "Client testimonial"}` } : l.quote;
  const photos = WORK.filter((w) => (l.photos as string[]).includes(w.src));
  const first = l.featured[0];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${cat.label} at ${SITE.name}`,
    serviceType: cat.label,
    provider: { "@id": `${SITE.url}/#business` },
    areaServed: "Portland, OR",
    offers: all
      .filter((s) => s.price != null)
      .map((s) => ({ "@type": "Offer", name: s.name, price: s.price, priceCurrency: "USD" })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <section className="relative overflow-hidden bg-ink pb-16 pt-32 sm:pt-40 lg:pb-24">
        <div aria-hidden className="absolute -right-32 top-10 size-[38rem] rounded-full bg-crimson/[0.13] blur-3xl" />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>{l.eyebrow}</Eyebrow>
            <h1 className="display mt-5 text-[clamp(2.8rem,7.4vw,5.6rem)] text-bone">
              {l.h1[0]} <Accent>{l.h1[1]}</Accent> {l.h1[2]}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist/90">{l.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={bookHref(first)} className="btn btn-primary">
                <CalendarHeart className="size-4" aria-hidden /> Book {cat.short.toLowerCase()}
              </Link>
              <a href="#menu" className="btn btn-ghost">
                See prices <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
          <div className="relative mx-auto h-[24rem] w-full max-w-md sm:h-[30rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img width={600} height={800} src={cat.art} alt={`Red line drawing — ${cat.label}`} className="absolute inset-0 m-auto h-full w-auto drop-shadow-[0_0_18px_rgba(249,37,5,0.35)]" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-onyx py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionTitle eyebrow="Done right" title={<>Why clients <Accent>choose</Accent> us</>} intro={l.problem} />
          <ul className="reveal grid content-start gap-3" data-delay="100">
            {l.points.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-ink/60 px-5 py-4 text-bone">
                <Check className="size-4 shrink-0 text-flare" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="menu" className="scroll-mt-24 bg-ink py-20 lg:py-28">
        <div className="wrap">
          <SectionTitle eyebrow={`${cat.label} menu`} title={<>Real prices. <Accent>Real</Accent> times.</>} />
          <ul className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {all.map((s) => (
              <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-5 sm:grid-cols-[1fr_8rem_9rem_auto]">
                <div>
                  <p className="text-lg text-bone">{s.name}</p>
                  {s.desc && <p className="text-sm text-silver">{s.desc}</p>}
                </div>
                <p className="order-3 flex items-center gap-1.5 text-sm text-silver sm:order-none">
                  <Clock className="size-3.5" aria-hidden /> {fmtDuration(s.minutes)}
                </p>
                <p className="text-right tabular-nums text-bone sm:text-left">{fmtPrice(s)}</p>
                <Link href={bookHref(s.id)} className="order-4 inline-flex min-h-11 items-center justify-end gap-1.5 text-sm text-flare hover:text-paper sm:order-none" aria-label={`Book ${s.name}`}>
                  <CalendarHeart className="size-4" aria-hidden /> Book
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-silver">From the salon’s Square booking menu, Oct 26 2026. Final price confirmed before your service.</p>
        </div>
      </section>

      {(photos.length > 0 || review) && (
        <section className="bg-onyx py-20 lg:py-28">
          <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((w, i) => (
                  <figure key={w.src} className={`reveal overflow-hidden rounded-[var(--radius-card)] ${i === 1 ? "mt-10" : ""}`} data-delay={i * 80}>
                    <Img src={w.src} alt={w.alt} w={w.w} h={w.h} sizes="(max-width: 1024px) 50vw, 25vw" className="aspect-[4/5] w-full object-cover" />
                  </figure>
                ))}
              </div>
            ) : (
              <div className="reveal grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img width={600} height={800} src={cat.art} alt="" aria-hidden loading="lazy" className="h-80 w-auto opacity-70" />
              </div>
            )}
            {review ? (
              <blockquote className="reveal" data-delay="120">
                <Quote className="size-8 text-red" aria-hidden />
                <p className="mt-5 text-2xl leading-snug text-bone sm:text-3xl">“{review.text}”</p>
                <footer className="mt-5 text-silver">{review.by}</footer>
              </blockquote>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}

      <section className="bg-ink py-20 lg:py-28">
        <div className="wrap">
          <SectionTitle eyebrow="Book with" title={<>Your <Accent>stylist</Accent></>} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(l.stylists as StaffKey[]).map((k) => {
              const t = TEAM_BY_KEY[k];
              return (
                <li key={k} className="card-night flex items-center gap-4 p-5">
                  {t.photo ? (
                    <Img src={t.photo} alt={t.name} w={1000} h={1333} small={560} sizes="64px" className="size-16 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-16 shrink-0 place-items-center rounded-full border border-dashed border-flare/60 text-xl text-flare">{t.name[0]}</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-lg text-bone">{t.name}</p>
                    <p className="text-sm text-silver">{t.role}</p>
                    <Link href={`/team#${t.key}`} className="inline-flex min-h-11 items-center text-sm text-flare hover:text-paper">
                      Meet {t.name.split(" ")[0]} →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] bg-crimson p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="display text-3xl sm:text-4xl">Ready for your {cat.short.toLowerCase()}?</p>
              <p className="mt-2 text-paper">
                {SERVICE_BY_ID[first].name} · {fmtPrice(SERVICE_BY_ID[first])} · {fmtDuration(SERVICE_BY_ID[first].minutes)}
              </p>
            </div>
            <Link href={bookHref(first)} className="btn bg-paper text-char hover:bg-bone">
              <CalendarHeart className="size-4" aria-hidden /> Book now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
