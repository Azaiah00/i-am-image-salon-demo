import Link from "next/link";
import { CalendarHeart, Clock, Mail, MapPin, Phone } from "lucide-react";
import { BOOK_HREF, NAV, SITE, hm } from "@/lib/site";
import { CATEGORIES } from "@/lib/services";
import { FacebookIcon, InstagramIcon } from "./BrandIcons";

export function Footer() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-onyx pb-28 pt-20 sm:pb-12">
      <div aria-hidden className="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-crimson/10 blur-3xl" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/logo-dark.svg" alt="I Am Image Salon logo" width={96} height={220} className="h-48 w-auto" loading="lazy" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-silver">
            Elevate your look. Empower your image. Proudly serving Portland and the metro area since {SITE.foundedLabel}.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={SITE.socials.instagram} target="_blank" rel="noopener" aria-label="I Am Image on Instagram" className="grid size-11 place-items-center rounded-full border border-white/12 text-mist transition hover:border-flare hover:text-paper">
              <InstagramIcon className="size-5" />
            </a>
            <a href={SITE.socials.facebook} target="_blank" rel="noopener" aria-label="I Am Image on Facebook" className="grid size-11 place-items-center rounded-full border border-white/12 text-mist transition hover:border-flare hover:text-paper">
              <FacebookIcon className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="eyebrow text-silver">Services</h2>
          <ul className="mt-5 space-y-1">
            {CATEGORIES.filter((c) => c.slug).map((c) => (
              <li key={c.key}>
                <Link href={`/services/${c.slug}`} className="inline-flex min-h-10 items-center text-mist/85 hover:text-paper">
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="inline-flex min-h-10 items-center text-flare hover:text-paper">
                Full menu & prices
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-silver">Salon</h2>
          <ul className="mt-5 space-y-1">
            {[...NAV, { href: "/journal", label: "Journal" }, { href: "/careers", label: "Join our team" }, { href: "/portal", label: "Client & staff portal" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-10 items-center text-mist/85 hover:text-paper">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-silver">Visit</h2>
          <address className="mt-5 space-y-3 not-italic text-mist/90">
            <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="flex gap-3 hover:text-paper">
              <MapPin className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden />
              <span>
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.zip}
                <br />
                <span className="text-sm text-silver">In {SITE.address.building}</span>
              </span>
            </a>
            <a href={SITE.phoneHref} className="flex min-h-10 items-center gap-3 hover:text-paper">
              <Phone className="size-4 shrink-0 text-flare" aria-hidden /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex min-h-10 items-center gap-3 break-all hover:text-paper">
              <Mail className="size-4 shrink-0 text-flare" aria-hidden /> {SITE.email}
            </a>
          </address>
          <div className="mt-5 flex gap-3 text-sm">
            <Clock className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden />
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {order.map((i) => {
                const h = SITE.hours[i];
                return (
                  <div key={h.day} className="contents">
                    <dt className="text-silver">{h.day.slice(0, 3)}</dt>
                    <dd className="text-mist/90">{h.open ? `${hm(h.open)} – ${hm(h.close!)}` : "Closed"}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <Link href={BOOK_HREF} className="btn btn-primary mt-7">
            <CalendarHeart className="size-4" aria-hidden /> Book now
          </Link>
        </div>
      </div>

      <div className="wrap relative mt-16 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-silver sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} I Am Image Salon · Black-owned & woman-owned · Portland, Oregon</p>
        <p>
          Website by{" "}
          <a href="https://couturehouse.co" target="_blank" rel="noopener" className="text-mist hover:text-paper">
            Couture House Co.
          </a>
        </p>
      </div>
    </footer>
  );
}
