"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostSummary } from "@/lib/blog";
import { matchPosts, postHref, resultsLabel } from "./search";
import { useNarrow } from "./useNarrow";

// Hub search plus the posts grouped by year, newest first.
export default function HubPosts({
  posts,
  placeholder,
}: {
  posts: PostSummary[];
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const narrow = useNarrow();
  const visible = matchPosts(posts, query);
  const years = Array.from(new Set(visible.map((post) => post.year)));

  return (
    <>
      <div className="mgrid">
        <div className="mspacer" />
        <div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={narrow ? "Search this hub…" : placeholder}
            aria-label="Search posts in this hub"
            className="search mt-7 m:mt-4 m:text-[13px]"
          />
          <p className="sr-only" role="status">
            {query.trim() ? resultsLabel(visible.length) : ""}
          </p>
        </div>
      </div>

      {years.map((year) => (
        <section key={year} className="pt-12 m:pt-[26px]">
          <div className="mgrid items-baseline">
            <h2 className="text-right text-[30px] font-medium leading-tight text-acc m:text-left m:text-[26px]">
              {year}
            </h2>
            <div className="mspacer" />
          </div>
          <div className="mt-2 m:mt-1">
            {visible
              .filter((post) => post.year === year)
              .map((post) => (
                <Link key={postHref(post)} href={postHref(post)} className="group mgrid row py-3.5 m:py-3">
                  <span className="mnote pt-1.5">{post.monthDay}</span>
                  <span>
                    <span className="block text-[22px] font-medium leading-tight text-ink group-hover:text-acc m:text-[19px]">
                      {post.title}
                    </span>
                    {post.description && (
                      <span className="mt-1 block max-w-[72ch] text-base leading-normal text-tx2 m:hidden">
                        {post.description}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}

      {visible.length === 0 && (
        <div className="mgrid row mt-10 py-4">
          <div className="mspacer" />
          <p className="text-lg text-tx2">No entries match “{query.trim()}”.</p>
        </div>
      )}
    </>
  );
}
