import type { MetadataRoute } from "next";
import { IS_DEMO_HOST, SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (IS_DEMO_HOST) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/portal", "/book"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
