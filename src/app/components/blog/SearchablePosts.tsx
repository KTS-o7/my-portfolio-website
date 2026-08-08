"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import PostRow from "./PostRow";
import type { BlogPostSummary } from "./BlogIndex";

export const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 0.45 },
    { name: "description", weight: 0.2 },
    { name: "tags", weight: 0.15 },
    { name: "dateLabel", weight: 0.12 },
    { name: "sectionLabel", weight: 0.08 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
};

/**
 * Scoped fuzzy search over a fixed set of posts. Renders the full list
 * until a query is typed. Used on section pages (single-section scope).
 */
export default function SearchablePosts({
  posts,
  placeholder,
}: {
  posts: BlogPostSummary[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => new Fuse(posts, FUSE_OPTIONS), [posts]);

  const searching = query.trim().length > 0;
  const visible = searching
    ? fuse.search(query.trim()).map((r) => r.item)
    : posts;

  return (
    <>
      <div className="mt-10">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder ?? "Search this section…"}
          aria-label="Search posts in this section"
          className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-3 font-mono text-sm text-text-primary placeholder:text-text-tertiary transition-colors"
        />
      </div>

      {searching && (
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-text-tertiary">
          {visible.length} result{visible.length === 1 ? "" : "s"}
        </p>
      )}

      <div className="mt-6">
        {visible.map((post) => (
          <PostRow key={`${post.section}/${post.slug}`} post={post} />
        ))}
        {searching && visible.length === 0 && (
          <p className="border-t border-border py-5 text-sm text-text-secondary">
            No posts match “{query.trim()}”.
          </p>
        )}
      </div>
    </>
  );
}
