import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/profile";
import experienceData from "@/data/experience.json";
import workData from "@/data/work.json";
import { getAllPosts, getSections } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const blogSectionUrls = getSections().map((section) => ({
    url: `${siteUrl}/blog/${section}`,
    lastModified,
  }));

  const blogPostUrls = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.section}/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : lastModified,
  }));

  const experienceUrls = experienceData.experience?.map((entry) => ({
    url: `${siteUrl}/experience/${entry.slug}`,
    lastModified,
  })) || [];

  const workUrls = (workData.work || []).map((item) => ({
    url: `${siteUrl}/work/${item.slug}`,
    lastModified,
  }));

  return [
    { url: `${siteUrl}/`, lastModified },
    { url: `${siteUrl}/about`, lastModified },
    { url: `${siteUrl}/projects`, lastModified },
    { url: `${siteUrl}/publications`, lastModified },
    { url: `${siteUrl}/contact`, lastModified },
    { url: `${siteUrl}/experience`, lastModified },
    ...experienceUrls,
    ...workUrls,
    { url: `${siteUrl}/blog`, lastModified },
    ...blogSectionUrls,
    ...blogPostUrls,
    { url: `${siteUrl}/llms.txt`, lastModified },
  ];
}
