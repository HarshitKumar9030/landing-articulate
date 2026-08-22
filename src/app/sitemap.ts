import type { MetadataRoute } from "next";

const siteUrl = "https://articulatex.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date("2026-08-21"), changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms-of-service`, lastModified: new Date("2026-08-21"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
