import type { MetadataRoute } from "next";

const SITE_URL = "https://temantravel.com";

const LOCALES = ["en", "id"] as const;
const ROUTES = ["", "/privacy", "/terms", "/cancellation"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const isHome = route === "";
      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: isHome ? "weekly" : "monthly",
        priority: isHome ? 1.0 : 0.5,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${route}`,
            id: `${SITE_URL}/id${route}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
