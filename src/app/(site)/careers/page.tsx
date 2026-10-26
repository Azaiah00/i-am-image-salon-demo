import type { Metadata } from "next";
import { HeartHandshake, Sparkles, TrendingUp } from "lucide-react";
import { Accent, PageHero } from "@/components/ui/Kit";
import { CareersForm } from "@/components/site/Forms";

export const metadata: Metadata = {
  title: "Join Our Team — Stylist & Barber Jobs in NW Portland",
  description: "I Am Image is always seeking talented, dedicated, passionate stylists. Apply to join a supportive, growth-focused salon in Portland’s Northwest District.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Join our team"
        art="/media/art/braids.svg"
        title={
          <>
            Take your craft to the <Accent>next</Accent> level.
          </>
        }
        intro="At I Am Image, we are always seeking talented, dedicated, and passionate stylists to join our exceptional team. Here, you’ll find more than just a job — you’ll discover a community that inspires, supports, and invests in both you and our clients."
      />
      <section className="bg-ink py-16 lg:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <ul className="space-y-4">
            {[
              { icon: TrendingUp, t: "Growth", b: "A dynamic environment that fosters growth, creativity and professional development." },
              { icon: HeartHandshake, t: "Community", b: "A team that supports and invests in you — and in the clients you serve together." },
              { icon: Sparkles, t: "Your talent, front and center", b: "A full-service salon in Portland’s Northwest District, established in 2011, where your talent thrives." },
            ].map((x) => (
              <li key={x.t} className="card-night flex gap-4 p-6">
                <x.icon className="mt-1 size-6 shrink-0 text-flare" aria-hidden />
                <div>
                  <p className="text-xl text-bone">{x.t}</p>
                  <p className="mt-1 text-mist/80">{x.b}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="card-night p-6 sm:p-8">
            <h2 className="display text-3xl text-bone">Apply now</h2>
            <p className="mt-2 text-sm text-silver">Takes about two minutes.</p>
            <div className="mt-6">
              <CareersForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
