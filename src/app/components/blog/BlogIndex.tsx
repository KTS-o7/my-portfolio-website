"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import PostRow from "./PostRow";
import { FUSE_OPTIONS } from "./SearchablePosts";

export type BlogPostSummary = {
  section: string;
  sectionLabel: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  dateLabel: string;
};

type SectionGroup = {
  section: string;
  label: string;
  total: number;
};

export default function BlogIndex({
  sections,
  posts,
  allPosts,
}: {
  sections: SectionGroup[];
  posts: BlogPostSummary[];
  allPosts: BlogPostSummary[];
}) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => new Fuse(allPosts, FUSE_OPTIONS), [allPosts]);

  const searching = query.trim().length > 0;
  const results = searching
    ? fuse.search(query.trim()).map((r) => r.item)
    : [];

  return (
    <>
      <div className="mt-10">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts — try 'rag', 'kubernetes', 'kv cache'…"
          aria-label="Search blog posts"
          className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-3 font-mono text-sm text-text-primary placeholder:text-text-tertiary transition-colors"
        />
      </div>

      {searching ? (
        <section className="mt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          <div className="mt-6">
            {results.map((post) => (
              <PostRow key={`${post.section}/${post.slug}`} post={post} />
            ))}
            {results.length === 0 && (
              <p className="border-t border-border py-5 text-sm text-text-secondary">
                No posts match “{query.trim()}”.
              </p>
            )}
          </div>
        </section>
      ) : (
        sections.map(({ section, label, total }) => {
          const sectionPosts = posts.filter((p) => p.section === section);
          if (sectionPosts.length === 0) return null;
          return (
            <section key={section} className="mt-16">
              <div className="flex items-baseline justify-between">
                <h2 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  {label}
                </h2>
                <Link
                  href={`/blog/${section}`}
                  className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors link-underline"
                >
                  All {total} →
                </Link>
              </div>
              <div className="mt-6">
                {sectionPosts.map((post) => (
                  <PostRow key={`${post.section}/${post.slug}`} post={post} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
