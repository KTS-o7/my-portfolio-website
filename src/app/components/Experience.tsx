"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import experienceData from "@/data/experience.json";

type ExperienceEntry = {
  slug: string;
  company: { name: string; url?: string };
  role: string;
  type?: string;
  location?: string;
  timeframe?: string;
  summary?: string;
  highlights?: string[];
  skills?: string[];
  caseStudies?: { title: string; href: string }[];
};

export default function Experience({
  showTopBorder = true,
  condensed = false,
  showSeeMore = true,
}: {
  showTopBorder?: boolean;
  condensed?: boolean;
  showSeeMore?: boolean;
}) {
  const entries = (experienceData.experience || []) as ExperienceEntry[];

  return (
    <section
      id="experience"
      className={`bg-background py-20 sm:py-28 relative scroll-mt-24 ${
        showTopBorder ? "border-t border-border" : ""
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Experience
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            Roles, outcomes, and the systems behind them
          </h2>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Company-by-company: scope, constraints, and outcomes. Projects live
            separately so you can scan artifacts quickly.
          </p>
        </motion.div>

        <div className="mt-10">
          {entries.map((entry, index) => (
            <motion.article
              key={entry.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.05, 0.2),
              }}
              className="border-t border-border py-10 last:border-b"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
                <div className="lg:col-span-3">
                  <div className="font-mono text-xs text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                    {entry.timeframe}
                  </div>
                  {entry.type && (
                    <div className="mt-2 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      {entry.type}
                    </div>
                  )}
                  {entry.location && (
                    <div className="mt-2 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      {entry.location}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-9 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
                    {entry.company?.url ? (
                      <a
                        href={entry.company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        {entry.company.name}
                      </a>
                    ) : (
                      entry.company?.name
                    )}
                  </h3>
                  <div className="mt-1 text-text-secondary">{entry.role}</div>

                  {entry.summary && (
                    <p className="mt-4 text-text-secondary leading-relaxed max-w-[80ch]">
                      {entry.summary}
                    </p>
                  )}

                  {Array.isArray(entry.highlights) &&
                    entry.highlights.length > 0 && (
                      <ul className="mt-5 space-y-2 text-text-secondary">
                        {(condensed
                          ? entry.highlights.slice(0, 2)
                          : entry.highlights
                        ).map((item) => (
                          <li key={item} className="flex gap-3 leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                  {Array.isArray(entry.skills) && entry.skills.length > 0 && (
                    <p className="mt-5 font-mono text-xs leading-relaxed text-text-tertiary">
                      {entry.skills
                        .slice(0, condensed ? 6 : 10)
                        .join(" · ")}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                      href={`/experience/${entry.slug}`}
                      className="link-underline text-text-primary font-mono text-sm"
                    >
                      View experience →
                    </Link>
                    {Array.isArray(entry.caseStudies) &&
                      entry.caseStudies.map((cs) => (
                        <Link
                          key={cs.href}
                          href={cs.href}
                          className="link-underline text-text-secondary font-mono text-sm"
                        >
                          {cs.title} →
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {showSeeMore && (
          <div className="mt-10">
            <Link href="/experience" className="btn">
              See full experience timeline →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
