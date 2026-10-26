import type { Metadata } from "next";
import { Clock, CreditCard, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Accent, PageHero } from "@/components/ui/Kit";
import { ContactForm } from "@/components/site/Forms";
import { MapEmbed } from "@/components/site/MapEmbed";
import { FaqList } from "@/components/ui/FaqList";
import { GOOD_TO_KNOW, SITE, hm } from "@/lib/site";
import { FAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "Visit & Contact — 1500 NW 18th Ave, Portland",
  description: "I Am Image Salon, 1500 NW 18th Ave Suite 104, Portland OR 97209. Open Mon, Tue & Thu 10–8, Fri 10–5, Sat 8:30–5. Call (503) 224-0399.",
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <>
      <PageHero
        eyebrow="Visit & contact"
        art="/media/art/silkpress.svg"
        title={
          <>
            Come see us in <Accent>Portland.</Accent>
          </>
        }
        intro={`Suite 104 inside ${SITE.address.building} — 1500 NW 18th Ave in the Northwest District.`}
      />
      <section className="bg-ink py-16 lg:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="space-y-6">
            <div className="card-night p-6 sm:p-8">
              <ul className="space-y-5">
                <li>
                  <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="flex gap-4 text-lg text-bone hover:text-paper">
                    <MapPin className="mt-1 size-5 shrink-0 text-flare" aria-hidden />
                    <span>
                      {SITE.address.street}
                      <br />
                      {SITE.address.city}, {SITE.address.region} {SITE.address.zip}
                      <span className="block text-sm text-silver">Inside {SITE.address.building}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="flex items-center gap-4 text-lg text-bone hover:text-paper">
                    <Phone className="size-5 shrink-0 text-flare" aria-hidden /> {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 break-all text-lg text-bone hover:text-paper">
                    <Mail className="size-5 shrink-0 text-flare" aria-hidden /> {SITE.email}
                  </a>
                </li>
              </ul>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="btn btn-primary mt-7">
                <Navigation className="size-4" aria-hidden /> Get directions
              </a>
            </div>
            <div className="card-night p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-xl text-bone">
                <Clock className="size-5 text-flare" aria-hidden /> Hours
              </h2>
              <dl className="mt-5 grid grid-cols-[7rem_1fr] gap-y-2 text-mist/90">
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
              <p className="mt-4 text-sm text-silver">Book online any time, day or night.</p>
            </div>
            <div className="card-night p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-xl text-bone">
                <CreditCard className="size-5 text-flare" aria-hidden /> Ways to pay
              </h2>
              <p className="mt-3 text-mist/85">{SITE.payments.join(" · ")}</p>
            </div>
          </div>
          <div className="space-y-6">
            <MapEmbed />
            <div className="card-night p-6 sm:p-8">
              <h2 className="display text-3xl text-bone">Send a message</h2>
              <p className="mt-2 text-sm text-silver">For bookings, the fastest way is online or by phone.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-white/[0.06] bg-onyx py-16 lg:py-24">
        <div className="wrap">
          <h2 className="display text-4xl text-bone sm:text-5xl">Before your visit</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GOOD_TO_KNOW.map((g) => (
              <li key={g.title} className="card-night p-6">
                <p className="text-bone">{g.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-mist/80">{g.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-flare/50 p-6">
            <p className="needs-tag">Needs client confirmation</p>
            <p className="mt-3 text-sm text-mist/85">Salon-wide deposit, cancellation, late-arrival and children-in-salon policies aren’t published yet. Once Kayla confirms them they appear here and in the booking portal.</p>
          </div>
          <div className="mt-14 max-w-3xl">
            <FaqList items={FAQ} />
          </div>
        </div>
      </section>
    </>
  );
}
