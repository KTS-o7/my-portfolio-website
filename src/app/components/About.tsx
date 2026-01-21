"use client";
import React from "react";
import { motion } from "framer-motion";
import aboutData from "@/data/about.json";
import { TechStack } from "./ui/TechStack";

export default function About() {
  return (
    <section
      className="bg-background py-20 sm:py-28 relative overflow-hidden border-t border-text-tertiary/10 scroll-mt-24"
      id="about"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="pill">About</span>
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary">
            A backend engineer who ships with intent
          </h2>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            I care about systems that are easy to reason about: clear contracts,
            predictable performance, and observability that tells the truth.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 surface-card p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
              {aboutData.title}
            </h3>
            <div className="mt-4 space-y-4 text-text-secondary leading-relaxed">
              <p>{aboutData.description.primary}</p>
              <p className="text-text-tertiary">
                {aboutData.description.secondary}
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[14px] border border-[var(--border)] p-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Location
                </dt>
                <dd className="mt-2 text-text-primary">{aboutData.location}</dd>
              </div>
              <div className="rounded-[14px] border border-[var(--border)] p-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Availability
                </dt>
                <dd className="mt-2 text-text-primary">{aboutData.status}</dd>
              </div>
            </dl>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="surface-card p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Strengths
              </h3>
              <ul className="mt-4 space-y-2 text-text-secondary">
                {aboutData.specializations.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Toolbox
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {aboutData.skills.slice(0, 14).map((skill) => (
                  <span key={skill} className="pill">
                    {skill}
                  </span>
                ))}
              </div>
              {aboutData.skills.length > 14 && (
                <div className="mt-4 text-sm text-text-tertiary">
                  + {aboutData.skills.length - 14} more in the full toolbox
                  below.
                </div>
              )}
            </div>

            <div className="surface-card p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Education & Credentials
              </h3>
              <div className="mt-4 space-y-4">
                {(aboutData.education || []).map((edu) => (
                  <div
                    key={`${edu.degree}-${edu.institution}`}
                    className="rounded-[14px] border border-[var(--border)] p-4"
                  >
                    <div className="text-text-primary font-medium">
                      {edu.degree}
                    </div>
                    <div className="mt-1 text-text-secondary">
                      {edu.institution}
                    </div>
                    <div className="mt-2 text-xs font-mono uppercase tracking-widest text-text-tertiary">
                      {edu.period}
                      {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                    </div>
                  </div>
                ))}
                {(aboutData.certifications || []).length > 0 && (
                  <details className="rounded-[14px] border border-[var(--border)] p-4">
                    <summary className="cursor-pointer text-text-secondary">
                      Certifications & publications
                    </summary>
                    <ul className="mt-3 space-y-2 text-sm text-text-tertiary">
                      {aboutData.certifications.map((cert) => (
                        <li key={cert}>{cert}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12">
          <TechStack />
        </div>
      </div>
    </section>
  );
}
