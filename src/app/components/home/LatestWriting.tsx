import React from "react";
import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export default function LatestWriting() {
  const posts = getAllPosts().slice(0, 5);
  if (posts.length === 0) return null;

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Latest writing
        </p>
        <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
          Notes from the blog
        </h2>

        <div className="mt-10">
          {posts.map((post) => (
            <Link
              key={`${post.section}/${post.slug}`}
              href={`/blog/${post.section}/${post.slug}`}
              className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-border py-6 last:border-b"
            >
              <span className="font-mono text-xs text-text-tertiary">
                {formatPostDate(post.date)}
              </span>
              <span className="min-w-0">
                <span className="block text-lg sm:text-xl font-semibold tracking-tight text-text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
                  {post.title}
                </span>
                {post.description && (
                  <span className="mt-1 block text-sm text-text-secondary truncate">
                    {post.description}
                  </span>
                )}
              </span>
              <span className="col-start-2 sm:col-start-auto font-mono text-xs uppercase tracking-widest text-text-tertiary sm:text-right">
                {post.section}
                <span className="ml-3 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/blog" className="btn">
            All writing →
          </Link>
        </div>
      </div>
    </section>
  );
}
