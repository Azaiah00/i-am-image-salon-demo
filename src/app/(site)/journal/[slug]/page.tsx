import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarHeart, Check } from "lucide-react";
import { ARTICLES, ARTICLE_BY_SLUG } from "@/lib/journal";
import { SERVICE_BY_ID, fmtDuration, fmtPrice } from "@/lib/services";
import { SITE, bookHref } from "@/lib/site";
import { Eyebrow } from "@/components/ui/Kit";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLE_BY_SLUG[slug];
  if (!a) return {};
  return { title: { absolute: `${a.title} | I Am Image` }, description: a.dek, alternates: { canonical: `/journal/${slug}` }, openGraph: { type: "article", title: a.title, description: a.dek } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLE_BY_SLUG[slug];
  if (!a) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.dek,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#business` },
    mainEntityOfPage: `${SITE.url}/journal/${a.slug}`,
  };
  return (
    <article className="bg-ink pb-24 pt-32 sm:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap max-w-3xl">
        <Link href="/journal" className="inline-flex min-h-11 items-center gap-2 text-sm text-silver hover:text-paper">
          <ArrowLeft className="size-4" aria-hidden /> The Image Journal
        </Link>
        <Eyebrow className="mt-6">
          {a.category} · {a.minutes} min read
        </Eyebrow>
        <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.2rem)] text-bone">{a.title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-mist/85">{a.dek}</p>
        <div className="my-10 grid h-72 place-items-center rounded-[var(--radius-card)] border border-white/[0.07] bg-onyx">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={600} height={800} src={a.art} alt="" aria-hidden className="h-[90%] w-auto" />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-mist/90">
          {a.body.map((b, i) =>
            b.h ? (
              <h2 key={i} className="display pt-6 text-3xl text-bone">
                {b.h}
              </h2>
            ) : b.list ? (
              <ul key={i} className="space-y-2">
                {b.list.map((li) => (
                  <li key={li} className="flex gap-3">
                    <Check className="mt-1.5 size-4 shrink-0 text-flare" aria-hidden /> {li}
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{b.p}</p>
            ),
          )}
        </div>
        <aside className="card-night mt-14 p-6 sm:p-8" aria-label="Book a related service">
          <p className="eyebrow text-silver">Book it</p>
          <ul className="mt-4 divide-y divide-white/[0.07]">
            {a.serviceIds.map((id) => {
              const s = SERVICE_BY_ID[id];
              return (
                <li key={id} className="flex items-center justify-between gap-4 py-3">
                  <span>
                    <span className="block text-bone">{s.name}</span>
                    <span className="text-sm text-silver">
                      {fmtPrice(s)} · {fmtDuration(s.minutes)}
                    </span>
                  </span>
                  <Link href={bookHref(id)} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-flare hover:text-paper">
                    <CalendarHeart className="size-4" aria-hidden /> Book
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </article>
  );
}
