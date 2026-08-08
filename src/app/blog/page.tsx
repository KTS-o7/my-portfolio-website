import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BlogIndex, {
  type BlogPostSummary,
} from "@/app/components/blog/BlogIndex";
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
  const sections = getSections().map((section) => ({
    section,
    label: getSectionLabel(section),
  }));

  const posts: BlogPostSummary[] = sections.flatMap(({ section, label }) =>
    getPostsBySection(section).map((post) => ({
      section: post.section,
      sectionLabel: label,
      slug: post.slug,
      title: post.title,
      description: post.description ?? "",
      tags: post.tags,
      dateLabel: formatPostDate(post.date),
    })),
  );

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Blog
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            Writing
          </h1>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Notes and longer pieces on ML systems, distributed systems, and
            infrastructure.
          </p>

          <BlogIndex sections={sections} posts={posts} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
