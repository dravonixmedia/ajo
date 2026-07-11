import type { MetadataRoute } from "next";
import { ALL_CATEGORY_SLUGS } from "@/lib/content/photos";

const siteUrl = "https://ajo.dravonix.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...ALL_CATEGORY_SLUGS.map((slug) => ({
      url: `${siteUrl}/portfolio/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
