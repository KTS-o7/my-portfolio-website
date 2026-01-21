import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
    },
    {
      url: `${siteUrl}/llm.txt`,
      lastModified,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified,
    },
  ];
}
