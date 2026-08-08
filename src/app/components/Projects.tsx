"use client";
import React, { useState, useRef, FC } from "react";
import { motion, useInView } from "framer-motion";
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

const Projects: FC<{ showTopBorder?: boolean }> = ({
  showTopBorder = true,
}) => {
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
      className={`py-20 sm:py-28 px-4 sm:px-6 bg-background relative scroll-mt-24 ${
        showTopBorder ? "border-t border-border" : ""
      }`}
    >
      <div className="max-w-[1100px] mx-auto relative z-10">
        <div className="mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Selected work
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
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
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-x-6 gap-y-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [mask-image:linear-gradient(to_right,black_85%,transparent)]">
            {projectsData.categories.map((category) => (
              <button
                key={category}
                onClick={() => handleTagChange(category)}
                className={`min-h-[44px] flex-shrink-0 font-mono text-xs uppercase tracking-widest link-underline transition-colors ${
                  tag === category
                    ? "text-text-primary"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
                aria-pressed={tag === category}
              >
                {category}
              </button>
            ))}
            {/* Visual spacer for end of list */}
            <div className="w-12 flex-shrink-0 sm:hidden"></div>
          </div>
          <div className="mt-3 font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Showing {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "item" : "items"} · Filter: {tag}
          </div>
        </div>

        <ul ref={ref}>
          {filteredProjects.map((project: ProjectData, index: number) => {
            const meta = project.tag.filter((t) => t !== "All").join(" · ");

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
                className="border-t border-border py-8 last:border-b"
              >
                <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2">
                  <span className="font-mono text-xs text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
                    {project.name}
                  </h3>
                  <span className="col-start-2 sm:col-start-auto font-mono text-xs uppercase tracking-widest text-text-tertiary sm:text-right">
                    {meta}
                  </span>
                </div>

                <p className="mt-3 sm:ml-10 text-text-secondary leading-relaxed max-w-[80ch]">
                  {project.description}
                </p>

                <dl className="mt-5 sm:ml-10 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 text-sm">
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
                  {Array.isArray(project.tech) && project.tech.length > 0 && (
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                        Tech
                      </dt>
                      <dd className="mt-2 text-text-secondary leading-relaxed">
                        {project.tech.join(", ")}
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

                <div className="mt-5 sm:ml-10 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {project.links?.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-text-primary font-mono text-sm"
                    >
                      Live demo ↗
                    </a>
                  )}
                  {project.links?.paper && (
                    <a
                      href={project.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-text-primary font-mono text-sm"
                    >
                      Read paper ↗
                    </a>
                  )}
                  {(project.links?.source || project.link) && (
                    <a
                      href={project.links?.source || project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-text-secondary font-mono text-sm"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
