"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    name: "Project 1",
    description: "This is a brief description of Project 1.",
    image: "./Images/li.svg",
    github: "https://github.com/yourusername/project1",
    tag: ["All", "Software"],
  },
  {
    id: 2,
    name: "Project 2",
    description: "This is a brief description of Project 2.",
    image: "./Images/li.svg",
    github: "https://github.com/yourusername/project2",
    tag: ["All", "Hardware"],
  },
  {
    id: 3,
    name: "Project 3",
    description: "This is a brief description of Project 3.",
    image: "./Images/li.svg",
    github: "https://github.com/yourusername/project3",
    tag: ["All", "Hardware"],
  },
  {
    id: 4,
    name: "Project 4",
    description: "This is a brief description of Project 4.",
    image: "./Images/li.svg",
    github: "https://github.com/yourusername/project4",
    tag: ["All", "Software"],
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
          className={`px-3 py-2 rounded-md text-base font-lg lg:text-2xl ${
            tag === "All"
              ? "text-black bg-yellow-500"
              : "text-yellow-500 bg-black"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTagChange("Software")}
          className={`px-3 py-2 rounded-md text-base font-lg lg:text-2xl ${
            tag === "Software"
              ? "text-black bg-yellow-500"
              : "text-yellow-500 bg-black"
          }`}
        >
          Software
        </button>
        <button
          onClick={() => handleTagChange("Hardware")}
          className={`px-3 py-2 rounded-md text-base font-lg lg:text-2xl ${
            tag === "Hardware"
              ? "text-black bg-yellow-500"
              : "text-yellow-500 bg-black"
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
            <div className="rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-56 object-cover"
                src={project.image}
                alt={project.name}
              />
              <div className="p-6 bg-gray-800">
                <h2 className="text-2xl font-bold mb-2 text-yellow-500">
                  {project.name}
                </h2>
                <p className="text-gray-300 text-lg lg:text-xl">
                  {project.description}
                </p>
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
