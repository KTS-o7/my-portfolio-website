"use client";
import React from "react";
import techData from "@/data/technologies.json";
import NextImage from "next/image";

export const TechStack = () => {
  const coreSet = new Set([
    "Python",
    "FastAPI",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "LangGraph",
    "LiteLLM",
  ]);

  const core = techData.technologies.filter((tech) => coreSet.has(tech.name));
  const rest = techData.technologies.filter((tech) => !coreSet.has(tech.name));

  return (
    <section aria-labelledby="toolbox" className="surface-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="pill">Toolbox</span>
          <h3
            id="toolbox"
            className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-text-primary"
          >
            Tools I reach for in production
          </h3>
          <p className="mt-3 text-text-secondary leading-relaxed max-w-[72ch]">
            A curated core set, plus a wider toolbox depending on the problem.
          </p>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-text-tertiary">
          Total: {techData.technologies.length}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {core.map((tech) => (
          <span key={tech.name} className="pill">
            {tech.name}
          </span>
        ))}
      </div>

      <details className="mt-8 rounded-[14px] border border-[var(--border)] p-4">
        <summary className="cursor-pointer text-text-secondary">
          Full toolbox
        </summary>
        <ul className="mt-4 columns-2 md:columns-3 gap-6">
          {rest.map((tech) => (
            <li
              key={tech.name}
              className="break-inside-avoid flex items-center gap-2 py-1 text-sm text-text-tertiary"
            >
              <span className="relative h-5 w-5 flex-shrink-0">
                <NextImage
                  src={tech.logo}
                  alt=""
                  fill
                  sizes="20px"
                  className="object-contain opacity-80"
                />
              </span>
              <span>{tech.name}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
};
