import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BlogIndex, {
  type BlogPostSummary,
} from "@/app/components/blog/BlogIndex";
import CopyRssButton from "@/app/components/blog/CopyRssButton";
import {
  formatPostDate,
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

  const sections = getSections().map((section) => {
    const total = getPostsBySection(section).length;
    return {
      section,
      label: `${getSectionLabel(section)}`,
      total,
    };
  });

  const toSummary = (section: string, label: string) =>
    getPostsBySection(section).map((post) => ({
      section: post.section,
      sectionLabel: label,
      slug: post.slug,
      title: post.title,
      description: post.description ?? "",
      tags: post.tags,
      dateLabel: formatPostDate(post.date),
    }));

  const posts: BlogPostSummary[] = sections.flatMap(
    ({ section, label }) => toSummary(section, label).slice(0, PREVIEW_COUNT),
  );
  const allPosts: BlogPostSummary[] = sections.flatMap(({ section, label }) =>
    toSummary(section, label),
  );

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

          <BlogIndex sections={sections} posts={posts} allPosts={allPosts} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
