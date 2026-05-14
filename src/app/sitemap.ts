import type { MetadataRoute } from "next";

const SITE_URL = "https://temantravel.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          id: `${SITE_URL}/id`,
        },
      },
    },
    {
      url: `${SITE_URL}/id`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          id: `${SITE_URL}/id`,
        },
      },
    },
  ];
}
