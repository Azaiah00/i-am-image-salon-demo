import type { Metadata } from "next";
import { DemoBanner, Toasts } from "@/components/portal/ui";

export const metadata: Metadata = {
  title: { default: "Book Online", template: "%s · I Am Image Booking" },
  description: "Book I Am Image Salon online — choose your service, stylist and time in under a minute.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-ink">
      <DemoBanner />
      <main id="main">{children}</main>
      <Toasts />
    </div>
  );
}
