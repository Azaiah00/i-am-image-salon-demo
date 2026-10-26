import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/services";
import { ARTICLES } from "@/lib/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-26");
  const pages = ["", "/services", "/team", "/gallery", "/about", "/visit", "/careers", "/journal"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...CATEGORIES.filter((c) => c.slug).map((c) => ({ url: `${SITE.url}/services/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...ARTICLES.map((a) => ({ url: `${SITE.url}/journal/${a.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
