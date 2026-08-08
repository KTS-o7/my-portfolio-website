import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
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

          <div className="mt-10">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.section}/${post.slug}`}
                className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-border py-5 last:border-b"
              >
                <span className="font-mono text-xs text-text-tertiary">
                  {formatPostDate(post.date)}
                </span>
                <span className="min-w-0">
                  <span className="block text-base sm:text-lg font-semibold tracking-tight text-text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
                    {post.title}
                  </span>
                  {post.description && (
                    <span className="mt-1 block text-sm text-text-secondary truncate">
                      {post.description}
                    </span>
                  )}
                </span>
                <span className="hidden sm:block font-mono text-xs text-text-tertiary transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
