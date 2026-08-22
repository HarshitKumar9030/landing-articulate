import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://articulatex.in/sitemap.xml",
    host: "https://articulatex.in",
  };
}
