import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/profile";
import experienceData from "@/data/experience.json";
import workData from "@/data/work.json";
import { type BlogPostMeta, getAllPosts, getPostsBySection, getSections } from "@/lib/blog";

const modified = (post: BlogPostMeta) => post.lastmod ?? post.date;

// The most recent publish or update date in a list of posts.
const newest = (posts: BlogPostMeta[]) => {
  const times = posts.map(modified).filter(Boolean).map((d) => new Date(d!).getTime());
  return times.length ? { lastModified: new Date(Math.max(...times)) } : {};
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();

  const blogSectionUrls = getSections().map((section) => ({
    url: `${siteUrl}/blog/${section}`,
    ...newest(getPostsBySection(section)),
  }));

  const blogPostUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.section}/${post.slug}`,
    ...(modified(post) ? { lastModified: new Date(modified(post)!) } : {}),
  }));

  const experienceUrls = experienceData.experience.map((entry) => ({
    url: `${siteUrl}/experience/${entry.slug}`,
  }));

  const workUrls = workData.work.map((item) => ({
    url: `${siteUrl}/work/${item.slug}`,
  }));

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/projects` },
    { url: `${siteUrl}/contact` },
    { url: `${siteUrl}/experience` },
    ...experienceUrls,
    ...workUrls,
    { url: `${siteUrl}/blog`, ...newest(posts) },
    ...blogSectionUrls,
    ...blogPostUrls,
  ];
}
