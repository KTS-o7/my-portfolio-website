"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import experienceData from "@/data/experience.json";

export default function FeaturedExperience() {
  const entries = experienceData.experience.slice(0, 2);

  return (
    <section className="bg-background py-20 sm:py-24 border-t border-text-tertiary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="pill">Experience</span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            Where I&apos;ve shipped
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map((entry, i) => (
            <motion.article
              key={entry.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface-card p-6 flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary">{entry.company.name}</h3>
                  {entry.type && <span className="pill">{entry.type}</span>}
                </div>
                <p className="mt-1 text-text-secondary text-sm">{entry.role} · {entry.timeframe}</p>
                {entry.summary && (
                  <p className="mt-3 text-text-secondary text-sm leading-relaxed line-clamp-3">{entry.summary}</p>
                )}
                {entry.skills && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {entry.skills.slice(0, 5).map((s) => (
                      <span key={s} className="pill text-[11px]">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <Link href={`/experience/${entry.slug}`} className="btn btn-secondary text-sm w-fit">
                View details →
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/experience" className="btn btn-secondary">
            View all experience →
          </Link>
        </div>
      </div>
    </section>
  );
}
