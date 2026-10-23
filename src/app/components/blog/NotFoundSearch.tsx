"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostSummary } from "@/lib/blog";
import { matchPosts, postHref } from "./search";

const MAX_RESULTS = 8;

export default function NotFoundSearch({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const results = query.trim() ? matchPosts(posts, query).slice(0, MAX_RESULTS) : [];

  return (
    <div className="mt-6 max-w-[560px]">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${posts.length} entries…`}
        aria-label="Search blog posts"
        className="search"
      />
      {query.trim() && (
        <ul className="mt-3" role="status">
          {results.map((post) => (
            <li key={postHref(post)}>
              <Link href={postHref(post)} className="group row flex items-baseline justify-between gap-4 py-2.5">
                <span className="text-[19px] font-medium leading-snug text-ink group-hover:text-acc">{post.title}</span>
                <span className="whitespace-nowrap font-mono text-[11px] text-tx2">{post.sectionLabel}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="row py-2.5 text-lg text-tx2">No entries match.</li>}
        </ul>
      )}
    </div>
  );
}
