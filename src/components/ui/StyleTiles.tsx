import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, SERVICES, fmtMoney, fromPrice, servicesIn } from "@/lib/services";

/** Category tiles drawn in the same red line as the hero — each opens its service page. */
export function StyleTiles() {
  const cats = CATEGORIES.filter((c) => c.slug);
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cats.map((c, i) => {
        const from = fromPrice(c.key);
        const n = servicesIn(c.key).length;
        return (
          <li key={c.key} className="reveal" data-delay={i * 60}>
            <Link
              href={`/services/${c.slug}`}
              className="group relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/[0.08] bg-onyx p-4 transition duration-500 hover:-translate-y-1 hover:border-red/50 sm:min-h-[21rem] sm:p-5"
            >
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-crimson/15 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img width={600} height={800} src={c.art} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute -right-4 top-6 h-[78%] w-auto opacity-80 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100 sm:right-0" />
              <span className="relative text-xs tracking-[0.3em] text-silver">0{i + 1}</span>
              <span className="relative mt-auto">
                <span className="display block text-[1.6rem] text-bone sm:text-3xl">{c.short}</span>
                <span className="mt-1 flex items-center justify-between gap-2 text-sm text-silver">
                  <span>
                    {from != null ? `From ${fmtMoney(from)}` : "See prices"} · {n} services
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-flare transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
      <li className="reveal" data-delay={cats.length * 60}>
        <Link
          href="/services"
          className="group flex h-full min-h-[17rem] flex-col justify-between rounded-[var(--radius-card)] bg-crimson p-4 text-paper transition duration-500 hover:-translate-y-1 hover:bg-ember sm:min-h-[21rem] sm:p-5"
        >
          <span className="text-xs tracking-[0.3em] text-paper">ALL</span>
          <span>
            <span className="display block text-[1.6rem] sm:text-3xl">Full menu</span>
            <span className="mt-1 flex items-center justify-between text-sm text-paper">
              {SERVICES.length} services, real prices <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </span>
        </Link>
      </li>
    </ul>
  );
}
