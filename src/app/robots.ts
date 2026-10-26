import type { MetadataRoute } from "next";
import { IS_DEMO_HOST, SITE } from "@/lib/site";

/**
 * Crawling is allowed everywhere so link-preview bots (iMessage, WhatsApp, Facebook,
 * X, LinkedIn, Slack) can always read the share card. What stays out of Google is
 * controlled by <meta name="robots" content="noindex">: the whole netlify.app demo,
 * plus /portal and /book on the live domain.
 */
export default function robots(): MetadataRoute.Robots {
  if (IS_DEMO_HOST) return { rules: [{ userAgent: "*", allow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
