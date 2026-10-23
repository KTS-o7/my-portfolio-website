import type { Metadata } from "next";
import Link from "next/link";
import NotFoundSearch from "@/app/components/blog/NotFoundSearch";
import { getAllPosts, getSectionLabel, getSections, toSummary } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mgrid pb-24 pt-[88px] m:pb-12 m:pt-10">
      <div className="mspacer" />
      <div>
        <div className="text-[180px] font-medium leading-[0.85] tracking-[-0.04em] text-ink m:text-[110px]" aria-hidden="true">
          404
        </div>
        <h1 className="mt-6 text-[40px] font-medium leading-[1.1] text-ink m:text-[30px]">
          This page isn&apos;t in the notebook.
        </h1>
        <p className="mt-3 max-w-[52ch] text-[21px] leading-normal m:text-[18px]">
          It may have moved, or the link has a typo. Search the writing, or start from one of the hubs.
        </p>
        <NotFoundSearch posts={getAllPosts().map(toSummary)} />
        <nav
          aria-label="Writing hubs"
          className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[22px] font-medium text-ink m:text-[19px]"
        >
          {getSections().map((section) => (
            <Link key={section} href={`/blog/${section}`}>
              {getSectionLabel(section)}
            </Link>
          ))}
          <Link href="/" className="self-center font-mono text-[13px] font-normal text-acc">
            ← home
          </Link>
        </nav>
      </div>
    </section>
  );
}
