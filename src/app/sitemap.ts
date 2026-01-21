import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/profile";
import experienceData from "@/data/experience.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const companyUrls =
    experienceData.experience?.map((entry) => ({
      url: `${siteUrl}/work/${entry.slug}`,
      lastModified,
    })) || [];

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
      url: `${siteUrl}/work`,
      lastModified,
    },
    ...companyUrls,
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
