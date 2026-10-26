"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarHeart, Clock, Search, X } from "lucide-react";
import { CATEGORIES, SERVICES, fmtDuration, fmtPrice, type CategoryKey } from "@/lib/services";
import { bookHref } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Full menu: sticky category chips + instant search. Every row books that exact service. */
export function MenuBrowser({ initial = "all" }: { initial?: CategoryKey | "all" }) {
  const [cat, setCat] = useState<CategoryKey | "all">(initial);
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    return CATEGORIES.filter((c) => cat === "all" || c.key === cat)
      .map((c) => ({
        c,
        items: SERVICES.filter((s) => s.category === c.key && (!term || `${s.name} ${s.desc ?? ""} ${s.square}`.toLowerCase().includes(term))),
      }))
      .filter((g) => g.items.length);
  }, [cat, q]);

  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <div className="sticky top-[4.1rem] z-30 -mx-5 border-y border-white/[0.07] bg-ink/90 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex min-h-11 items-center lg:w-72">
            <Search className="pointer-events-none absolute left-4 size-4 text-silver" aria-hidden />
            <span className="sr-only">Search the menu</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search — e.g. knotless, color, fade"
              className="h-11 w-full rounded-full border border-white/12 bg-onyx pl-11 pr-10 text-sm text-bone placeholder:text-silver/80 focus:border-flare focus:outline-none"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-1 grid size-9 place-items-center rounded-full text-silver hover:text-paper" aria-label="Clear search">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0" role="group" aria-label="Filter by category">
            {[{ key: "all" as const, short: "All" }, ...CATEGORIES].map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                aria-pressed={cat === c.key}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-4 text-sm transition",
                  cat === c.key ? "border-red bg-crimson text-paper" : "border-white/12 text-mist/85 hover:border-white/30 hover:text-paper",
                )}
              >
                {c.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-silver" aria-live="polite">
        {count} {count === 1 ? "service" : "services"}
        {q && <> matching “{q}”</>}
      </p>

      {groups.length === 0 && (
        <div className="card-night mt-6 p-8 text-center">
          <p className="text-bone">Nothing matches that search.</p>
          <p className="mt-1 text-sm text-silver">Try a simpler word, or book a consultation and we’ll plan it with you.</p>
        </div>
      )}

      <div className="mt-4 space-y-14">
        {groups.map(({ c, items }) => (
          <section key={c.key} aria-labelledby={`cat-${c.key}`} id={c.key} className="scroll-mt-40">
            <div className="flex items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 id={`cat-${c.key}`} className="display text-3xl text-bone sm:text-4xl">
                  {c.label}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-silver">{c.blurb}</p>
              </div>
              {c.slug && (
                <Link href={`/services/${c.slug}`} className="hidden min-h-11 shrink-0 items-center text-sm text-flare hover:text-paper sm:inline-flex">
                  About {c.short.toLowerCase()} →
                </Link>
              )}
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {items.map((s) => (
                <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[1fr_9rem_7rem_auto]">
                  <div className="min-w-0">
                    <p className="text-bone">
                      {s.name}
                      {s.popular && <span className="ml-2 rounded-full bg-red/15 px-2 py-0.5 align-middle text-[0.65rem] font-medium uppercase tracking-[0.14em] text-flare">Popular</span>}
                      {s.addOn && <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 align-middle text-[0.65rem] uppercase tracking-[0.14em] text-silver">Add-on</span>}
                    </p>
                    {s.desc && <p className="mt-0.5 text-sm leading-relaxed text-silver">{s.desc}</p>}
                  </div>
                  <p className="order-3 col-span-1 flex items-center gap-1.5 text-sm text-silver sm:order-none sm:col-span-1">
                    <Clock className="size-3.5" aria-hidden /> {fmtDuration(s.minutes)}
                  </p>
                  <p className="text-right tabular-nums text-bone sm:text-left">{fmtPrice(s)}</p>
                  <Link
                    href={bookHref(s.id)}
                    className="order-4 col-start-2 inline-flex min-h-11 items-center justify-end gap-1.5 text-sm text-flare hover:text-paper sm:order-none sm:col-start-auto"
                    aria-label={`Book ${s.name}`}
                  >
                    <CalendarHeart className="size-4" aria-hidden /> Book
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
