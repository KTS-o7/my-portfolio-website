import type { Metadata } from "next";
import Link from "next/link";
import WorkHead from "@/app/components/work/WorkHead";
import { buildPageMetadata } from "@/lib/metadata";
import { experience } from "@/lib/portfolio";

export const metadata: Metadata = buildPageMetadata({
  title: "Experience",
  description:
    "Work experience and shipped outcomes — grouped by company, with linked case studies and supporting projects.",
  path: "/experience",
});

export default function ExperienceIndexPage() {
  return (
    <div className="pb-24 m:pb-12">
      <WorkHead active="experience" />
      <div className="mt-7 m:mt-5">
        {experience.map((entry) => (
          <article key={entry.slug} className="mgrid border-t border-rule2 py-8 m:py-6">
            <div className="mnote pt-2.5 leading-[1.8] m:leading-relaxed">
              <span className="mnote-line">{entry.timeframe}</span>
              {entry.type && <span className="mnote-line">{entry.type}</span>}
              {entry.location && <span className="mnote-line">{entry.location}</span>}
            </div>
            <div className="min-w-0 max-w-[820px]">
              <h2 className="text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.05] tracking-[-0.02em] text-ink m:text-[28px]">
                <Link href={`/experience/${entry.slug}`}>{entry.company.name}</Link>
              </h2>
              <div className="mt-1.5 font-mono text-[13px] text-acc">{entry.role}</div>
              {entry.summary && (
                <p className="mt-3.5 text-[21px] italic leading-normal text-ink m:text-[18px]">{entry.summary}</p>
              )}
              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="dash-list mt-4">
                  {entry.highlights.map((item) => (
                    <li
                      key={item}
                      className="border-t border-dotted border-rule2 py-2 text-[17px] leading-[1.55] m:text-base"
                    >
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {entry.company.url && (
                <a
                  href={entry.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center font-mono text-[13px] text-tx2 underline underline-offset-[3px]"
                >
                  {entry.company.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "")} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
