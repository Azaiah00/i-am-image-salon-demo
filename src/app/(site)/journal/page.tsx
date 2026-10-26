import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accent, PageHero } from "@/components/ui/Kit";
import { ARTICLES } from "@/lib/journal";

export const metadata: Metadata = {
  title: "The Image Journal — Hair Care Tips",
  description: "Hair care guidance from I Am Image in Portland: knotless vs box braids, making a silk press last, and what to expect with starter locs.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <PageHero eyebrow="The Image Journal" art="/media/art/kids.svg" title={<>Hair care, <Accent>explained.</Accent></>} intro="Honest guidance from the chair — so your style lasts longer and your hair stays healthy between visits." />
      <section className="bg-ink py-16 lg:py-24">
        <div className="wrap">
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((a, i) => (
              <li key={a.slug} className={i ? "reveal" : ""} data-delay={i * 80}>
                <Link href={`/journal/${a.slug}`} className="group card-night flex h-full flex-col overflow-hidden transition hover:border-red/40">
                  <div className="relative h-64 overflow-hidden border-b border-white/[0.06] bg-onyx">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img width={600} height={800} src={a.art} alt="" aria-hidden loading={i ? "lazy" : "eager"} className="absolute inset-0 m-auto h-[88%] w-auto transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow text-[0.66rem] text-silver">
                      {a.category} · {a.minutes} min read
                    </p>
                    <h2 className="mt-3 text-2xl leading-snug text-bone">{a.title}</h2>
                    <p className="mt-2 flex-1 text-mist/75">{a.dek}</p>
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
    </>
  );
}
