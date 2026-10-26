import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RevealObserver, SmoothScroll } from "@/components/site/Motion";
import { MobileBookBar } from "@/components/site/MobileBookBar";
import { LazyOverlays } from "@/components/site/LazyOverlays";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileBookBar />
      <LazyOverlays />
    </>
  );
}
