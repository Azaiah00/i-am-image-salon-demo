import type { Metadata } from "next";
import { Accent, Img, PageHero, PhotoSlot } from "@/components/ui/Kit";
import { InstagramIcon } from "@/components/site/BrandIcons";
import { WORK } from "@/lib/content";
import { CATEGORIES } from "@/lib/services";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery — Real Client Braids, Color & Cuts",
  description: "Real I Am Image clients: knotless braids, pixie cuts and color, wig installs, cornrows and more from our NW Portland salon.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const missing = CATEGORIES.filter((c) => c.slug && !WORK.some((w) => w.cat === c.key));
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        art="/media/art/pixie.svg"
        title={
          <>
            Real clients. Real <Accent>results.</Accent>
          </>
        }
        intro="Every photo is an I Am Image client, straight from the chair — no stock photos, no filters added by us."
      >
        <a href={SITE.socials.instagram} target="_blank" rel="noopener" className="btn btn-ghost mt-8">
          <InstagramIcon className="size-4" /> More on Instagram @kaylameans
        </a>
      </PageHero>
      <section className="bg-ink py-16 lg:py-24">
        <div className="wrap">
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {WORK.map((w, i) => (
              <li key={w.src} className={`${i > 2 ? "reveal " : ""}mb-4 break-inside-avoid`} data-delay={(i % 3) * 80}>
                <figure className="group relative overflow-hidden rounded-[var(--radius-card)] bg-onyx">
                  <Img src={w.src} alt={w.alt} w={w.w} h={w.h} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={i === 0} className="w-full transition duration-700 group-hover:scale-[1.03]" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-12 text-sm text-bone">{w.label}</figcaption>
                </figure>
              </li>
            ))}
            {missing.map((c) => (
              <li key={c.key} className="mb-4 break-inside-avoid">
                <PhotoSlot className="aspect-[4/5]" label={`${c.label} — client photos`} art={c.art} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
