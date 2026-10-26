import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, Check } from "lucide-react";
import { Accent, Img, PageHero, PhotoSlot } from "@/components/ui/Kit";
import { TEAM, REVIEWS } from "@/lib/content";
import { STAFF_CATEGORIES, CATEGORY_BY_KEY } from "@/lib/services";
import { BOOK_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Stylists — Kayla Means & Team",
  description: "Meet Kayla Means, owner of I Am Image since 2011, and the stylists and barber behind the chair in Portland’s Northwest District.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="The team"
        art="/media/art/barber.svg"
        title={
          <>
            The hands behind your <Accent>image.</Accent>
          </>
        }
        intro="Licensed specialists skilled in a wide range of techniques — and the kind of stylists clients stay with for a decade."
      />
      <section className="bg-ink py-20 lg:py-28">
        <div className="wrap space-y-24">
          {TEAM.map((t, i) => {
            const quotes = REVIEWS.filter((r) => r.stylist === t.name.split(" ")[0]).slice(0, 1);
            return (
              <article key={t.key} id={t.key} className="scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={`${i ? "reveal" : ""} ${i % 2 ? "lg:order-2" : ""}`}>
                  {t.photo ? (
                    <div className="overflow-hidden rounded-[var(--radius-card)] bg-graphite">
                      <Img src={t.photo} alt={`${t.name}, ${t.role} at I Am Image Salon`} w={1000} h={1333} small={560} sizes="(max-width: 1024px) 100vw, 50vw" priority={i === 0} className="aspect-[4/5] w-full object-cover" />
                    </div>
                  ) : (
                    <PhotoSlot className="aspect-[4/5]" label={`${t.name} — professional portrait`} art={t.key === "solo" ? "/media/art/barber.svg" : "/media/art/weave.svg"} />
                  )}
                </div>
                <div className={i ? "reveal" : ""} data-delay="100">
                  <p className="eyebrow text-silver">{t.role}</p>
                  <h2 className="display mt-3 text-5xl text-bone sm:text-6xl">{t.name}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-mist/90">{t.bio}</p>
                  {t.bioNote?.startsWith("NEEDS") && <p className="needs-tag mt-4">{t.bioNote}</p>}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {t.specialties.map((s) => (
                      <li key={s} className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-sm text-mist">
                        <Check className="size-3.5 text-flare" aria-hidden /> {s}
                      </li>
                    ))}
                  </ul>
                  {quotes.map((q) => (
                    <blockquote key={q.name} className="mt-8 border-l-2 border-red pl-5">
                      <p className="text-mist/90">“{q.text}”</p>
                      <footer className="mt-2 text-sm text-silver">{q.name} · {q.source === "Google" ? "Google review" : "Client testimonial"}</footer>
                    </blockquote>
                  ))}
                  <p className="mt-6 text-sm text-silver">
                    Books: {STAFF_CATEGORIES[t.key].filter((c) => c !== "consult").map((c) => CATEGORY_BY_KEY[c].short).join(" · ")}
                  </p>
                  <Link href={`${BOOK_HREF}${BOOK_HREF.startsWith("/") ? `?stylist=${t.key}` : ""}`} className="btn btn-primary mt-6">
                    <CalendarHeart className="size-4" aria-hidden /> Book with {t.name.split(" ")[0]}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
