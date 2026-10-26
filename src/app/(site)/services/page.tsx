import type { Metadata } from "next";
import { sharePreview } from "@/lib/og";
import Link from "next/link";
import { Info } from "lucide-react";
import { MenuBrowser } from "@/components/ui/MenuBrowser";
import { Accent, PageHero } from "@/components/ui/Kit";
import { BOOK_HREF, GOOD_TO_KNOW } from "@/lib/site";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services & Prices — Full Salon Menu",
  description: `All ${SERVICES.length} I Am Image services with real prices and times: locs, braids, Cécred silk press, color, cuts, sew-ins, relaxers, fades and kids’ styles in NW Portland.`,
  alternates: { canonical: "/services" },
  ...sharePreview({
    title: "The full menu · I Am Image Salon",
    description: `${SERVICES.length} services with prices and times up front: locs, braids, silk press, color, cuts, sew-ins, fades and kids' styles in NW Portland.`,
    path: "/services",
    image: "/og/menu.jpg",
    alt: "I Am Image Salon full menu: locs, braids, silk press, color and cuts, weaves and wigs, barber and kids.",
  }),
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Menu & prices"
        art="/media/art/weave.svg"
        title={
          <>
            Every <Accent>image</Accent>, priced.
          </>
        }
        intro={`${SERVICES.length} services for women, men and children — the same prices and times as our booking system. “From” prices depend on length and density; your stylist confirms the final price before starting.`}
      />
      <section className="bg-ink pb-24">
        <div className="wrap">
          <MenuBrowser />

          <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GOOD_TO_KNOW.map((g) => (
              <div key={g.title} className="card-night p-6">
                <p className="flex items-center gap-2 text-bone">
                  <Info className="size-4 text-flare" aria-hidden /> {g.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mist/80">{g.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-silver">Menu copied from the salon’s Square booking page, October 26, 2026. Service names lightly tidied for reading; prices and times unchanged.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={BOOK_HREF} className="btn btn-primary">
              Book an appointment
            </Link>
            <Link href="/book?service=consultation" className="btn btn-ghost">
              Not sure? Book a consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
