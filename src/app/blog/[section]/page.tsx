import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SearchablePosts from "@/app/components/blog/SearchablePosts";
import {
  formatPostDate,
  getPostsBySection,
  getSectionLabel,
  getSections,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSections().map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const label = getSectionLabel(section);
  return buildPageMetadata({
    title: `${label} | Blog | Krishnatejaswi Shenthar`,
    description: `Posts in the ${label} section of the blog.`,
    path: `/blog/${section}`,
  });
}

export default async function BlogSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const posts = getPostsBySection(section);
  if (posts.length === 0) notFound();

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-20">
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors link-underline"
          >
            ← Blog
          </Link>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {getSectionLabel(section)}
          </h1>

          <SearchablePosts
            posts={posts.map((post) => ({
              section: post.section,
              sectionLabel: getSectionLabel(post.section),
              slug: post.slug,
              title: post.title,
              description: post.description ?? "",
              tags: post.tags,
              dateLabel: formatPostDate(post.date),
            }))}
            placeholder={`Search ${getSectionLabel(section).toLowerCase()} — try a title, tag, or year…`}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
