"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    name: "Project 1",
    description: "This is a brief description of Project 1.",
    image: "/vercel.svg",
    github: "https://github.com/yourusername/project1",
    tag: ["All", "Software"],
  },
  {
    id: 2,
    name: "Project 2",
    description: "This is a brief description of Project 2.",
    image: "/next.svg",
    github: "https://github.com/yourusername/project2",
    tag: ["All", "Hardware"],
  },
  // Add more projects as needed
];

export default function Projects() {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects" className="py-12 px-4 bg-black text-white">
      <h2 className="text-4xl mb-8 text-center font-semibold">Projects</h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <button
          onClick={() => handleTagChange("All")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            tag === "All"
              ? "text-white bg-yellow-500"
              : "text-yellow-500 bg-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTagChange("Software")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            tag === "Software"
              ? "text-white bg-yellow-500"
              : "text-yellow-500 bg-white"
          }`}
        >
          Software
        </button>
        <button
          onClick={() => handleTagChange("Hardware")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            tag === "Hardware"
              ? "text-white bg-yellow-500"
              : "text-yellow-500 bg-white"
          }`}
        >
          Hardware
        </button>
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <div className="rounded-lg shadow-lg overflow-hidden bg-gray-700">
              <img
                className="w-full h-56 object-cover"
                src={project.image}
                alt={project.name}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-yellow-500">
                  {project.name}
                </h2>
                <p className="text-gray-300">{project.description}</p>
                <div className="mt-4">
                  <a
                    href={project.github}
                    className="text-yellow-500 hover:underline"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
