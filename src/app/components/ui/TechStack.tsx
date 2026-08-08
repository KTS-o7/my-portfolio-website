"use client";
import React from "react";
import Link from "next/link";
import techData from "@/data/technologies.json";

const groups: { label: string; names: string[] }[] = [
  {
    label: "Languages",
    names: ["Python", "JavaScript", "TypeScript", "C++", "Java", "Go"],
  },
  {
    label: "Backend & Data",
    names: ["FastAPI", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Kafka"],
  },
  {
    label: "AI & LLM",
    names: ["LangGraph", "LiteLLM", "LangChain", "OpenAI", "Hugging Face"],
  },
  {
    label: "Infra",
    names: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
  },
  {
    label: "Frontend",
    names: ["React", "Next.js", "Tailwind CSS", "Angular"],
  },
];

export const TechStack = () => {
  const available = new Set(techData.technologies.map((tech) => tech.name));
  const known = groups
    .map((group) => ({
      label: group.label,
      items: group.names.filter((name) => available.has(name)),
    }))
    .filter((group) => group.items.length > 0);
  const grouped = new Set(known.flatMap((group) => group.items));
  const rest = techData.technologies
    .map((tech) => tech.name)
    .filter((name) => !grouped.has(name));

  return (
    <section aria-labelledby="toolbox" className="border-t border-border pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Toolbox
          </p>
          <h3
            id="toolbox"
            className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-text-primary"
          >
            Tools I reach for in production
          </h3>
          <p className="mt-3 text-text-secondary leading-relaxed">
            A curated core set, plus a wider toolbox depending on the problem.
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Total: {techData.technologies.length}
        </div>
      </div>

      <dl className="mt-8 space-y-5">
        {known.map((group) => (
          <div key={group.label}>
            <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              {group.label}
            </dt>
            <dd className="mt-2 text-text-secondary leading-relaxed">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>

      {rest.length > 0 && (
        <details className="mt-8 border-t border-border pt-4">
          <summary className="cursor-pointer text-text-secondary">
            Full toolbox
          </summary>
          <p className="mt-4 text-sm text-text-tertiary leading-relaxed">
            {rest.join(", ")}
          </p>
        </details>
      )}
    </section>
  );
};
