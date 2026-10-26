import type { Metadata } from "next";
import Link from "next/link";
import { Award, CalendarHeart, HeartHandshake, Sparkles, Users } from "lucide-react";
import { Accent, Img, PageHero, SectionTitle } from "@/components/ui/Kit";
import { MirrorFaces } from "@/components/home/MirrorFaces";
import { BOOK_HREF, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Kayla Means & I Am Image — Since 2011",
  description: "I Am Image opened July 5, 2011 in Portland’s Northwest District. Owner Kayla Means and team serve every hair type. Black-owned & woman-owned.",
  alternates: { canonical: "/about" },
};

const ALLURE = [
  { icon: CalendarHeart, title: "Online booking", body: "We know you’re busy. Book your appointment yourself in under a minute — effortlessly fitting your beauty needs into your schedule." },
  { icon: Sparkles, title: "Licensed specialists", body: "Your hair deserves nothing less than premier care. Our stylists are skilled in a wide range of techniques, with the knowledge and precision to elevate your style." },
  { icon: HeartHandshake, title: "Personalized hair care", body: "An atmosphere designed to put you at ease, where exceptional care and a strong focus on your hair’s needs come together." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        art="/media/art/locs.svg"
        title={
          <>
            More than a salon. <Accent>An image.</Accent>
          </>
        }
        intro={SITE.whoWeAre}
      />

      <section className="bg-ink py-20 lg:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="reveal overflow-hidden rounded-[var(--radius-card)] bg-graphite">
            <Img src="/media/team/kayla" alt="Kayla Means, owner of I Am Image Salon" w={1000} h={1333} small={560} sizes="(max-width: 1024px) 100vw, 45vw" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <SectionTitle
              eyebrow="Meet the owner"
              title={
                <>
                  Hi, I’m <Accent>Kayla.</Accent>
                </>
              }
            />
            <div className="reveal mt-6 space-y-5 text-lg leading-relaxed text-mist/90" data-delay="100">
              <p>
                I’m a skilled hairstylist and the proud owner of I Am Image, bringing decades of experience and a dedication to mastering the art of hair. From precision cuts to creative color, I specialize in a wide range of services — whether it’s extensions, relaxers, perms, protective styles, or keratin treatments, I’ve got you covered.
              </p>
              <p>
                With a passion for delivering top-quality service, I ensure every client receives personalized care tailored to their hair needs. At I Am Image, we focus on empowering your image through exceptional hair care, no matter your hair type or texture. Let’s elevate your look together!
              </p>
            </div>
            <p className="reveal mt-6 text-sm text-silver" data-delay="160">— Kayla Means, in her own words</p>
            <Link href={`${BOOK_HREF}${BOOK_HREF.startsWith("/") ? "?stylist=kayla" : ""}`} className="btn btn-primary reveal mt-8" data-delay="200">
              <CalendarHeart className="size-4" aria-hidden /> Book with Kayla
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-onyx py-20 lg:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionTitle
              eyebrow="The logo"
              title={
                <>
                  Two faces. <Accent>One</Accent> image.
                </>
              }
              intro="Our mark is two profiles turned toward each other — and between them, the letter “I.” Above them, a spiral: the idea of you, taking shape. Below, the word “Salon,” mirrored like a reflection. It’s what happens here every day: you and your stylist, face to face, creating the image you see in the mirror."
            />
          </div>
          <div className="mx-auto w-full max-w-[18rem] sm:max-w-[21rem]">
            <MirrorFaces className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 lg:py-28">
        <div className="wrap">
          <SectionTitle eyebrow="Our allure" title={<>What you can <Accent>expect</Accent></>} />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {ALLURE.map((a, i) => (
              <li key={a.title} className="reveal card-night p-7" data-delay={i * 80}>
                <a.icon className="size-6 text-flare" aria-hidden />
                <h3 className="mt-5 text-2xl text-bone">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-mist/80">{a.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            <div className="card-night p-7">
              <p className="display text-5xl text-flare">2011</p>
              <p className="mt-2 text-mist/85">Opened July 5, 2011 in Portland’s Northwest District.</p>
            </div>
            <div className="card-night p-7">
              <Award className="size-7 text-flare" aria-hidden />
              <p className="mt-3 text-mist/85">Recognized by BusinessRate as a Top Hair Salon in Northwest District for 2026, based on Google reviews.</p>
            </div>
            <div className="card-night p-7">
              <Users className="size-7 text-flare" aria-hidden />
              <p className="mt-3 text-mist/85">Black-owned and woman-owned. Serving women, men and children of every hair type and texture.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
