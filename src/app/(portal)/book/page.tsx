import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Booker } from "@/components/portal/Booker";
import { PortalLogo } from "@/components/portal/ui";
import { sharePreview } from "@/lib/og";

export const metadata: Metadata = {
  title: "Book an appointment",
  ...sharePreview({
    title: "Book your next look · I Am Image Salon",
    description: "Pick your service, stylist and time online. Locs, braids, silk press, color, cuts and fades in NW Portland.",
    path: "/book",
    image: "/og/book.jpg",
    alt: "Book your next look at I Am Image Salon: online booking with price, stylist and time.",
  }),
};

export default function BookPage() {
  return (
    <>
      <header className="border-b border-white/[0.07]">
        <div className="wrap flex items-center justify-between py-3">
          <PortalLogo href="/" sub="Book online" />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/portal" className="hidden min-h-11 items-center text-mist/80 hover:text-paper sm:inline-flex">
              Sign in
            </Link>
            <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-mist/80 hover:text-paper">
              <ArrowLeft className="size-4" aria-hidden /> Website
            </Link>
          </div>
        </div>
      </header>
      <Booker />
    </>
  );
}
