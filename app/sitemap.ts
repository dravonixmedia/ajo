import type { MetadataRoute } from "next";
import { portfolioCategories } from "@/lib/content/photos";

const siteUrl = "https://ajoabraham.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...portfolioCategories.map((c) => ({
      url: `${siteUrl}/portfolio/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
