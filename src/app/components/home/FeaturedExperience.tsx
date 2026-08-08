"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import experienceData from "@/data/experience.json";

export default function FeaturedExperience() {
  const entries = experienceData.experience.slice(0, 2);

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Experience
          </p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            Where I&apos;ve shipped
          </h2>
        </motion.div>

        <div className="mt-10">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/experience/${entry.slug}`}
                className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-border py-6 last:border-b"
              >
                <span className="font-mono text-xs text-text-tertiary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg sm:text-xl font-semibold tracking-tight text-text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
                    {entry.company.name}
                  </span>
                  <span className="mt-1 block text-sm text-text-secondary truncate">
                    {entry.role}
                    {entry.summary ? ` — ${entry.summary}` : ""}
                  </span>
                </span>
                <span className="col-start-2 sm:col-start-auto font-mono text-xs uppercase tracking-widest text-text-tertiary sm:text-right">
                  {entry.timeframe}
                  <span className="ml-3 inline-block transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/experience" className="btn">
            View all experience →
          </Link>
        </div>
      </div>
    </section>
  );
}
