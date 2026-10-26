import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="relative grid min-h-[80svh] place-items-center overflow-hidden bg-ink px-5 pt-24 text-center">
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/15 blur-3xl" />
        <div className="relative">
          <p className="display text-[clamp(6rem,22vw,14rem)] leading-none text-bone">
            4<span className="text-red">0</span>4
          </p>
          <p className="mt-4 text-xl text-mist">This page isn’t part of the image.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Back home
            </Link>
            <Link href="/services" className="btn btn-ghost">
              See the menu
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
