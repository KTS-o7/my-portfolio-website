"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostSummary } from "@/lib/blog";
import { matchPosts, postHref, resultsLabel } from "./search";
import { useNarrow } from "./useNarrow";

type HubGroup = {
  section: string;
  label: string;
  total: number;
  top: PostSummary[];
};

export default function WritingIndex({
  intro,
  recent,
  hubs,
  allPosts,
}: {
  intro: string;
  recent: PostSummary[];
  hubs: HubGroup[];
  allPosts: PostSummary[];
}) {
  const [query, setQuery] = useState("");
  const narrow = useNarrow();
  const searching = query.trim().length > 0;
  const results = searching ? matchPosts(allPosts, query) : [];

  return (
    <>
      <section className="mgrid pt-14 m:pt-[26px]">
        <div className="mnote pt-4 m:hidden">
          <a href="/blog/rss.xml" className="link-u">
            rss
          </a>
        </div>
        <div>
          <h1 className="h-page">Writing</h1>
          <p className="lead mt-3.5 max-w-[46ch] m:mt-2.5">{intro}</p>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              narrow
                ? `Search ${allPosts.length} entries…`
                : `Search ${allPosts.length} entries — try 'raft', 'kubernetes', 'kv cache'…`
            }
            aria-label="Search blog posts"
            className="search mt-7 m:mt-[18px] m:text-[13px]"
          />
        </div>
      </section>

      {searching ? (
        <section className="pt-10 m:pt-7">
          <div className="mgrid">
            <div className="mnote" role="status">
              {resultsLabel(results.length)}
            </div>
            <div className="mspacer" />
          </div>
          <div className="m:mt-2">
            {results.map((post) => (
              <Link key={postHref(post)} href={postHref(post)} className="group mgrid row py-3.5 m:py-3">
                <span className="mnote pt-1.5">{post.date}</span>
                <span>
                  <span className="block text-[22px] font-medium leading-snug text-ink group-hover:text-acc m:text-[20px]">
                    {post.title}
                  </span>
                  <span className="mt-0.5 block text-base leading-normal text-tx2">
                    {post.sectionLabel} — {post.description}
                  </span>
                </span>
              </Link>
            ))}
            {results.length === 0 && (
              <div className="mgrid row py-4">
                <div className="mspacer" />
                <p className="text-lg text-tx2">No entries match “{query.trim()}”.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="pt-14 m:pt-7">
            <div className="mgrid items-baseline">
              <div className="mspacer" />
              <h2 className="h-list">Recent</h2>
            </div>
            <div className="mt-2.5 m:mt-1.5">
              {recent.map((post) => (
                <Link key={postHref(post)} href={postHref(post)} className="group mgrid row py-3.5 m:py-3">
                  <span className="mnote pt-1.5">
                    <span className="mnote-line">{post.date}</span>
                    <span className="mnote-line">{post.sectionLabel}</span>
                  </span>
                  <span className="text-[23px] font-medium leading-tight text-ink group-hover:text-acc m:text-[20px]">
                    {post.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {hubs.map((hub) => (
            <section key={hub.section} className="pt-[72px] m:pt-[30px]">
              <div className="mgrid items-baseline">
                <div className="mspacer" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="text-[clamp(34px,3.8vw,48px)] font-medium leading-tight tracking-[-0.02em] text-ink m:text-[32px]">
                    <Link href={`/blog/${hub.section}`} className="hover:text-acc">
                      {hub.label}
                    </Link>
                  </h2>
                  <Link
                    href={`/blog/${hub.section}`}
                    className="font-mono text-xs text-acc m:inline-flex m:min-h-11 m:items-center m:text-[11px]"
                  >
                    all {hub.total} →
                  </Link>
                </div>
              </div>
              <div className="mt-3.5 m:mt-1">
                {hub.top.map((post) => (
                  <Link key={postHref(post)} href={postHref(post)} className="group mgrid row py-3">
                    <span className="mnote pt-[5px] m:hidden">{post.date}</span>
                    <span className="text-[20px] font-medium leading-[1.3] text-ink group-hover:text-acc m:text-[18px]">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </>
  );
}
