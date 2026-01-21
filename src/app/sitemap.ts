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
      url: `${siteUrl}/about`,
      lastModified,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified,
    },
    {
      url: `${siteUrl}/publications`,
      lastModified,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
    },
    {
      url: `${siteUrl}/work/complianceos`,
      lastModified,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified,
    },
  ];
}
