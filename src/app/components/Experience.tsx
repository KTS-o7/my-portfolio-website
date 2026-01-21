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
      className={`bg-background py-20 sm:py-28 relative overflow-hidden scroll-mt-24 ${
        showTopBorder ? "border-t border-text-tertiary/10" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="pill">Experience</span>
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary">
            Roles, outcomes, and the systems behind them
          </h2>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Company-by-company: scope, constraints, and outcomes. Projects live
            separately so you can scan artifacts quickly.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6">
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
              className="surface-card p-6 sm:p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
                      {entry.company?.name}
                    </h3>
                    {entry.type && <span className="pill">{entry.type}</span>}
                  </div>

                  <div className="mt-2 text-text-secondary">
                    <span className="text-text-primary">{entry.role}</span>
                    {entry.timeframe ? ` · ${entry.timeframe}` : ""}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </div>

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
                    <div className="mt-6 flex flex-wrap gap-2">
                      {entry.skills
                        .slice(0, condensed ? 6 : 10)
                        .map((skill) => (
                          <span key={skill} className="pill">
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full lg:w-[320px]">
                  <Link
                    href={`/work/${entry.slug}`}
                    className="btn btn-primary"
                  >
                    View experience
                  </Link>
                  {entry.company?.url && (
                    <a
                      href={entry.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      Company site
                    </a>
                  )}
                  {Array.isArray(entry.caseStudies) &&
                    entry.caseStudies.length > 0 && (
                      <div className="rounded-[14px] border border-[var(--border)] p-4">
                        <div className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                          Case studies
                        </div>
                        <div className="mt-3 space-y-2">
                          {entry.caseStudies.map((cs) => (
                            <Link
                              key={cs.href}
                              href={cs.href}
                              className="link-underline text-text-primary"
                            >
                              {cs.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {showSeeMore && (
          <div className="mt-10">
            <Link href="/work" className="btn btn-secondary">
              See full experience timeline
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
