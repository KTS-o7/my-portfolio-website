"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import projectsData from "@/data/projects.json";

export default function FeaturedProjects() {
  const projects = projectsData.projects
    .filter((p) => !p.tag.includes("Publication"))
    .slice(0, 3);

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Selected work
          </p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            Projects that show how I think
          </h2>
        </motion.div>

        <div className="mt-10">
          {projects.map((project, i) => {
            const url =
              (project.links as any)?.demo ||
              (project.links as any)?.paper ||
              (project.links as any)?.source ||
              project.link;
            const meta = project.tag.filter((t) => t !== "All").join(" · ");
            const inner = (
              <>
                <span className="font-mono text-xs text-text-tertiary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg sm:text-xl font-semibold tracking-tight text-text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
                    {project.name}
                  </span>
                  <span className="mt-1 block text-sm text-text-secondary truncate">
                    {project.description}
                  </span>
                </span>
                <span className="col-start-2 sm:col-start-auto font-mono text-xs uppercase tracking-widest text-text-tertiary sm:text-right">
                  {meta}
                  <span className="ml-3 inline-block transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </>
            );
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-border py-6 last:border-b"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-border py-6 last:border-b">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8">
          <Link href="/projects" className="btn">
            See all projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
