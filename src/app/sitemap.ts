import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/profile";
import experienceData from "@/data/experience.json";
import workData from "@/data/work.json";
import { getAllPosts, getSections } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const blogSectionUrls = getSections().map((section) => ({
    url: `${siteUrl}/blog/${section}`,
  }));

  const blogPostUrls = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.section}/${post.slug}`,
    ...(post.date ? { lastModified: new Date(post.date) } : {}),
  }));

  const experienceUrls = experienceData.experience?.map((entry) => ({
    url: `${siteUrl}/experience/${entry.slug}`,
  })) || [];

  const workUrls = (workData.work || []).map((item) => ({
    url: `${siteUrl}/work/${item.slug}`,
  }));

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/projects` },
    { url: `${siteUrl}/publications` },
    { url: `${siteUrl}/contact` },
    { url: `${siteUrl}/experience` },
    ...experienceUrls,
    ...workUrls,
    { url: `${siteUrl}/blog` },
    ...blogSectionUrls,
    ...blogPostUrls,
  ];
}
