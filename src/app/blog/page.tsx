import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
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
  const sections = getSections();

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

          {sections.map((section) => {
            const posts = getPostsBySection(section);
            if (posts.length === 0) return null;
            return (
              <section key={section} className="mt-16">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                    {getSectionLabel(section)}
                  </h2>
                  <Link
                    href={`/blog/${section}`}
                    className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors link-underline"
                  >
                    All →
                  </Link>
                </div>
                <div className="mt-6">
                  {posts.map((post) => (
                    <Link
                      key={`${post.section}/${post.slug}`}
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
              </section>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
