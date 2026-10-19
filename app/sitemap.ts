import type { MetadataRoute } from "next";
import { modes } from "@/lib/quiz";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...Object.keys(modes).map((mode) => ({
      url: `${siteUrl}/${mode}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
