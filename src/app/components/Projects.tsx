"use client";
import React, { useState, useRef, FC } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import projectsData from "@/data/projects.json";
import { Card3D } from "./ui/Card3D";
import { TextReveal } from "./ui/TextReveal";

interface ProjectData {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  tag: string[];
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

  const cardVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section
      id="projects"
      className="py-20 sm:py-32 px-4 sm:px-6 bg-background relative overflow-hidden border-t border-text-tertiary/10 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end gap-4 mb-4"
          >
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-text-tertiary/20 uppercase tracking-tighter leading-none">
              Work
            </h2>
            <div className="h-px flex-grow bg-primary/30 mb-4"></div>
            <span className="font-mono text-primary text-sm mb-4">
              BUILD.LOG
            </span>
          </motion.div>
        </div>

        <div className="relative mb-12">
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [mask-image:linear-gradient(to_right,black_85%,transparent)]">
            {projectsData.categories.map((category) => (
              <button
                key={category}
                onClick={() => handleTagChange(category)}
                className={`px-4 py-3 min-h-[44px] flex-shrink-0 font-mono text-xs uppercase tracking-wider border transition-all ${
                  tag === category
                    ? "bg-primary text-black border-primary font-bold"
                    : "bg-transparent text-text-tertiary border-text-tertiary/30 hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
            {/* Visual spacer for end of list */}
            <div className="w-12 flex-shrink-0 sm:hidden"></div>
          </div>
        </div>

        <ul
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.li
              key={index}
              variants={cardVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <Card3D>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col h-full bg-surface border border-text-tertiary/30 hover:border-primary transition-all duration-300 relative overflow-hidden"
                >
                  {/* Technical overlay lines */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative h-48 flex-shrink-0 overflow-hidden border-b border-text-tertiary/30">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      src={project.image}
                      alt={`Screenshot of ${project.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-blue-500 dark:text-white font-mono uppercase group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                    </div>

                    <p className="text-text-secondary text-sm mb-6 font-mono line-clamp-3 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {project.tag
                        .filter((t) => t !== "All")
                        .map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider"
                          >
                            [{t}]
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center text-primary font-mono text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform pt-4 border-t border-text-tertiary/10">
                      <span>View_Source</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </Card3D>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
