import type { Metadata } from "next";
import { DemoBanner, Toasts } from "@/components/portal/ui";
import { TourGuide } from "@/components/portal/Tour";
import { sharePreview } from "@/lib/og";

export const metadata: Metadata = {
  title: { default: "Book Online", template: "%s · I Am Image Booking" },
  description: "Book I Am Image Salon online — choose your service, stylist and time in under a minute.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  ...sharePreview({
    title: "I Am Image Salon · Booking portal demo",
    description: "Try the new I Am Image booking portal as a client, the owner or a stylist. A guide walks you through every feature.",
    path: "/portal",
    image: "/og/portal.jpg",
    alt: "One portal, three views: client, owner and stylist. I Am Image booking portal demo.",
  }),
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-ink">
      <DemoBanner />
      <main id="main">{children}</main>
      <Toasts />
      <TourGuide />
    </div>
  );
}
