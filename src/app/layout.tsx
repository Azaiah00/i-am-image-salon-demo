import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { IS_DEMO_HOST, SITE } from "@/lib/site";
import { CATEGORIES, SERVICES } from "@/lib/services";

// Script accent: "optional" so a late-arriving script font never re-wraps a heading (no layout shift).
const jost = localFont({
  src: [{ path: "./fonts/jost-var.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-jost",
  display: "swap",
});
const pinyon = localFont({ src: "./fonts/pinyon.woff2", variable: "--font-pinyon", display: "optional", weight: "400" });

const TITLE = "I Am Image Salon | Black-Owned Hair Salon in NW Portland";
const DESC =
  "Locs, knotless braids, Cécred silk presses, color, cuts, sew-ins and fades for women, men and kids in NW Portland since 2011. Rated 5.0 on Google.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: "%s | I Am Image" },
  description: DESC,
  applicationName: SITE.name,
  keywords: [
    "hair salon Portland OR",
    "Black hair salon Portland",
    "Black-owned salon Portland",
    "knotless braids Portland",
    "locs Portland",
    "silk press Portland",
    "sew-in weave Portland",
    "hair color Portland natural hair",
    "NW Portland hair salon",
    "barber Portland fades",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    title: "I Am Image Salon — Elevate your look. Empower your image.",
    description: "Locs, braids, silk press, color & cuts for women, men and kids · NW Portland since 2011 · 5.0★ on Google.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "I Am Image Salon in NW Portland: Elevate your look. Empower your image." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "I Am Image Salon — Elevate your look. Empower your image.",
    description: "Locs, braids, silk press, color & cuts · NW Portland since 2011 · 5.0★ on Google.",
    images: ["/og.jpg"],
  },
  ...(IS_DEMO_HOST ? { robots: { index: false, follow: false } } : {}),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0b0a0a",
  width: "device-width",
  initialScale: 1,
};

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${SITE.url}/#business`,
  name: SITE.name,
  alternateName: "I Am Image",
  description: SITE.bio,
  slogan: SITE.tagline,
  url: SITE.url,
  telephone: "+1-503-224-0399",
  email: SITE.email,
  image: [`${SITE.url}/og.jpg`, `${SITE.url}/media/work/red-pixie-smile.webp`],
  logo: `${SITE.url}/icon-512.png`,
  priceRange: "$$",
  foundingDate: SITE.founded,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  hasMap: SITE.googleUrl,
  // Her own line: "Proudly serving Portland and the Metro Area."
  areaServed: ["Portland, OR", "Portland metropolitan area"],
  openingHoursSpecification: SITE.hours
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => h.open)
    .map(({ h, i }) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAY[i]}`, opens: h.open, closes: h.close })),
  sameAs: [SITE.socials.instagram, SITE.socials.facebook],
  paymentAccepted: SITE.payments.join(", "),
  founder: { "@type": "Person", name: SITE.owner, jobTitle: "Owner & Master Stylist" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Hair services",
    itemListElement: CATEGORIES.filter((c) => c.key !== "consult").map((c) => ({
      "@type": "OfferCatalog",
      name: c.label,
      itemListElement: SERVICES.filter((s) => s.category === c.key && s.price != null && !s.addOn).map((s) => ({
        "@type": "Offer",
        price: s.price,
        priceCurrency: "USD",
        ...(s.priceType === "from" ? { priceSpecification: { "@type": "PriceSpecification", minPrice: s.price, priceCurrency: "USD" } } : {}),
        itemOffered: { "@type": "Service", name: s.name },
      })),
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${pinyon.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-char">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
