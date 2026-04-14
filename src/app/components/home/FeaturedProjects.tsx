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
    <section className="bg-background py-20 sm:py-24 border-t border-text-tertiary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="pill">Selected work</span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            Projects that show how I think
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((project, i) => {
            const url =
              (project.links as any)?.demo ||
              (project.links as any)?.paper ||
              (project.links as any)?.source ||
              project.link;
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="surface-card p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-text-primary">{project.name}</h3>
                  <p className="mt-2 text-text-secondary text-sm leading-relaxed line-clamp-4">{project.description}</p>
                  {project.tech && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 4).map((t) => (
                        <span key={t} className="pill text-[11px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-sm w-fit"
                  >
                    View →
                  </a>
                )}
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8">
          <Link href="/projects" className="btn btn-secondary">
            See all projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
