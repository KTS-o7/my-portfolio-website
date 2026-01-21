"use client";
import React, { useState, useRef, FC } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import projectsData from "@/data/projects.json";

interface ProjectData {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  tag: string[];
  problem?: string;
  impact?: string;
  tech?: string[];
  links?: {
    demo?: string;
    source?: string;
    paper?: string;
  };
}

const Projects: FC = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.projects.filter((project) =>
    project.tag.includes(tag),
  );

  return (
    <section
      id="projects"
      className="py-20 sm:py-28 px-4 sm:px-6 bg-background relative overflow-hidden border-t border-text-tertiary/10 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="pill">Selected work</span>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary">
              Projects that show how I think and ship
            </h2>
            <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
              Each project is framed as a short case study: the problem, the
              approach, and the impact. If a metric isn’t available, I’m
              explicit about what changed.
            </p>
          </motion.div>
        </div>

        <div className="relative mb-12">
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [mask-image:linear-gradient(to_right,black_85%,transparent)]">
            {projectsData.categories.map((category) => (
              <button
                key={category}
                onClick={() => handleTagChange(category)}
                className={`px-4 py-3 min-h-[44px] flex-shrink-0 font-mono text-xs uppercase tracking-wider border rounded-full transition-all ${
                  tag === category
                    ? "bg-surface text-text-primary border-text-tertiary/40"
                    : "bg-transparent text-text-tertiary border-text-tertiary/25 hover:border-text-tertiary/45 hover:text-text-primary"
                }`}
              >
                {category}
              </button>
            ))}
            {/* Visual spacer for end of list */}
            <div className="w-12 flex-shrink-0 sm:hidden"></div>
          </div>
        </div>

        <ul ref={ref} className="space-y-6">
          {filteredProjects.map((project: ProjectData, index: number) => {
            const primaryUrl =
              project.links?.demo ||
              project.links?.paper ||
              project.links?.source ||
              project.link;

            return (
              <motion.li
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                }
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.06, 0.3),
                }}
              >
                <article className="surface-card overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-5 relative min-h-[220px] border-b md:border-b-0 md:border-r border-text-tertiary/20 bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)]">
                      <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.name}`}
                        className="absolute inset-0"
                      />
                      <Image
                        src={project.image}
                        alt={`Preview for ${project.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 42vw"
                      />
                    </div>

                    <div className="md:col-span-7 p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-text-primary">
                            {project.name}
                          </h3>
                          <p className="mt-2 text-text-secondary leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <div className="hidden sm:flex flex-wrap justify-end gap-2">
                          {project.tag
                            .filter((t) => t !== "All")
                            .map((t) => (
                              <span key={t} className="pill">
                                {t}
                              </span>
                            ))}
                        </div>
                      </div>

                      <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                        {project.problem && (
                          <div>
                            <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                              Problem
                            </dt>
                            <dd className="mt-2 text-text-secondary leading-relaxed">
                              {project.problem}
                            </dd>
                          </div>
                        )}
                        {Array.isArray(project.tech) &&
                          project.tech.length > 0 && (
                            <div>
                              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                                Tech
                              </dt>
                              <dd className="mt-2 flex flex-wrap gap-2">
                                {project.tech.slice(0, 6).map((item) => (
                                  <span key={item} className="pill">
                                    {item}
                                  </span>
                                ))}
                              </dd>
                            </div>
                          )}
                        {project.impact && (
                          <div>
                            <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                              Impact
                            </dt>
                            <dd className="mt-2 text-text-secondary leading-relaxed">
                              {project.impact}
                            </dd>
                          </div>
                        )}
                      </dl>

                      <div className="mt-7 flex flex-wrap gap-3">
                        {project.links?.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            Live demo
                          </a>
                        )}
                        {project.links?.paper && (
                          <a
                            href={project.links.paper}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            Read paper
                          </a>
                        )}
                        {(project.links?.source || project.link) && (
                          <a
                            href={project.links?.source || project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                          >
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
