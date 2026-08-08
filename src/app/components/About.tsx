"use client";
import React from "react";
import { motion } from "framer-motion";
import aboutData from "@/data/about.json";
import { TechStack } from "./ui/TechStack";

export default function About({
  showTopBorder = true,
}: {
  showTopBorder?: boolean;
}) {
  return (
    <section
      className={`bg-background py-20 sm:py-28 relative scroll-mt-24 ${
        showTopBorder ? "border-t border-border" : ""
      }`}
      id="about"
    >
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            About
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            A backend engineer who ships with intent
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            I care about systems that are easy to reason about: clear contracts,
            predictable performance, and observability that tells the truth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border-t border-border pt-10"
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

          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Location
              </dt>
              <dd className="mt-2 text-text-primary">{aboutData.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Availability
              </dt>
              <dd className="mt-2 text-text-primary">{aboutData.status}</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border-t border-border pt-10"
        >
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Strengths
          </h3>
          <ul className="mt-4 space-y-2 text-text-secondary">
            {aboutData.specializations.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border-t border-border pt-10"
        >
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Toolbox
          </h3>
          <p className="mt-4 text-text-secondary leading-relaxed">
            {aboutData.skills.join(", ")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border-t border-border pt-10"
        >
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Education & Credentials
          </h3>
          <div className="mt-6 space-y-6">
            {(aboutData.education || []).map((edu) => (
              <div key={`${edu.degree}-${edu.institution}`}>
                <div className="text-text-primary font-medium">
                  {edu.degree}
                </div>
                <div className="mt-1 text-text-secondary">
                  {edu.institution}
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  {edu.period}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                </div>
              </div>
            ))}
            {(aboutData.certifications || []).length > 0 && (
              <details className="border-t border-border pt-4">
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
        </motion.div>

        <div className="mt-12">
          <TechStack />
        </div>
      </div>
    </section>
  );
}
