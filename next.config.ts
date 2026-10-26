import type { NextConfig } from "next";

/**
 * Public address used for link previews (og:image), canonicals and the sitemap.
 * Priority: NEXT_PUBLIC_SITE_URL (set it to the real domain at launch) →
 * Netlify's built-in URL (the site's primary address, set automatically on every
 * Netlify build) → the demo fallback in src/lib/site.ts.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  poweredByHeader: false,
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
