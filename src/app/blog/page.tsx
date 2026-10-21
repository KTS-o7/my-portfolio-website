import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BlogIndex, {
  type BlogPostSummary,
} from "@/app/components/blog/BlogIndex";
import CopyRssButton from "@/app/components/blog/CopyRssButton";
import {
  type BlogPostMeta,
  formatPostDate,
  getAllPosts,
  getPostsBySection,
  getSectionLabel,
  getSections,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog | Krishnatejaswi Shenthar",
  description:
    "Writing on machine learning, distributed systems, infrastructure, and engineering notes.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const PREVIEW_COUNT = 6;
  const LATEST_COUNT = 5;

  const toSummary = (post: BlogPostMeta): BlogPostSummary => ({
    section: post.section,
    sectionLabel: getSectionLabel(post.section),
    slug: post.slug,
    title: post.title,
    description: post.description ?? "",
    tags: post.tags,
    dateLabel: formatPostDate(post.date),
  });

  // Sections with the most recent post come first. Posts inside a section
  // are already newest first.
  const newestTime = (section: string) => {
    const date = getPostsBySection(section)[0]?.date;
    return date ? new Date(date).getTime() : 0;
  };
  const sections = [...getSections()]
    .sort((a, b) => newestTime(b) - newestTime(a))
    .map((section) => ({
      section,
      label: getSectionLabel(section),
      total: getPostsBySection(section).length,
    }));

  const latest = getAllPosts().slice(0, LATEST_COUNT).map(toSummary);
  const posts: BlogPostSummary[] = sections.flatMap(({ section }) =>
    getPostsBySection(section).slice(0, PREVIEW_COUNT).map(toSummary),
  );
  const allPosts: BlogPostSummary[] = getAllPosts().map(toSummary);

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-20">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Blog
            </span>
            <span className="flex items-baseline gap-5">
              <Link
                href="/blog/rss.xml"
                className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-primary transition-colors link-underline"
              >
                RSS →
              </Link>
              <CopyRssButton />
            </span>
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            Writing
          </h1>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Notes and longer pieces on ML systems, distributed systems, and
            infrastructure.
          </p>

          <BlogIndex
            sections={sections}
            latest={latest}
            posts={posts}
            allPosts={allPosts}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
