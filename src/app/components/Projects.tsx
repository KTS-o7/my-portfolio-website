"use client";
import React, { useState, useRef, FC } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/legacy/image";

interface ProjectData {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  tag: string[];
}

const projectsData: ProjectData[] = [
  {
    id: 1,
    name: "Portfolio-GPT",
    description:
      "This is a portfolio website created using LLMs only. Allowed to iterate the design quickly.",
    image: "/proj/website.png",
    link: "https://github.com/KTS-o7/my-portfolio-website",
    tag: ["All", "Software"],
  },
  {
    id: 2,
    name: "Better Bing Image Downloader",
    description:
      "Python library to download images from Bing in bulk for Machine learning. 20+ Stars, Now availabe as a CLI tool.",
    image: "/proj/bingScrape.png",
    link: "https://github.com/KTS-o7/better_bing_image_downloader",
    tag: ["All", "Software"],
  },
  {
    id: 3,
    name: "QuantQuips",
    description:
      "Langchain based backtesting, algotrading and analytics. Appreciated by judges from JPMC.",
    image: "/proj/Qq.png",
    link: "https://github.com/KTS-o7/QuantQuips",
    tag: ["All", "Software"],
  },
  {
    id: 4,
    name: "RV Board",
    description:
      "Protyping Board for RVCE students using LPC2148 ARM7 microcontroller. Drivers developed in Assembly, Embedded C",
    image: "/proj/rvboard.png",
    link: "https://github.com/KTS-o7/RV_Board",
    tag: ["All", "Hardware"],
  },
  {
    id: 5,
    name: "Algorithmic-fusion-for-Lung-scan-classification",
    description:
      "Fusion of CNN algorithms for Multiple Lung Disease Classification.",
    image: "/publication/cnn.png",
    link: "https://github.com/KTS-o7/Algorithmic-fusion-for-Lung-scan-classification",
    tag: ["All", "Publication"],
  },
  {
    id: 6,
    name: "HandWrittenTripSheet OCR",
    description:
      "OCR for handwritten TripSheet using EasyOCR and RegEx. Increased accuracy by 40%",
    image: "/publication/ieeeTrip.png",
    link: "https://ieeexplore.ieee.org/document/10170030",
    tag: ["All", "Publication"],
  },
  {
    id: 7,
    name: "Evaluation of filters in CT and Xray images of Lungs classification",
    description:
      "A study on the effect of filters on the classification of CT and Xray images of Lungs.",
    image: "/publication/q3.png",
    link: "https://ijeecs.iaescore.com/index.php/IJEECS/article/view/34975/18055",
    tag: ["All", "Publication"],
  },
  // Add more projects as needed
];

const Projects: FC = () => {
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
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section
      id="projects"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black relative"
    >
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-40 sm:w-60 h-40 sm:h-60 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
            Projects & Publications
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 py-6 sm:py-8">
          {["All", "Software", "Hardware", "Publication"].map((category) => (
            <button
              key={category}
              onClick={() => handleTagChange(category)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-sm sm:text-base font-medium ${
                tag === category
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <ul
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.li
              key={index}
              variants={cardVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative z-0"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full block"
              >
                <div className="bg-gray-900 rounded-xl overflow-hidden h-full border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-500/10">
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      src={project.image}
                      alt={project.name}
                      width={500}
                      height={300}
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

                    <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                      <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-1">
                        {project.name}
                      </h3>
                      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                        {project.tag
                          .filter((t) => t !== "All")
                          .map((t, i) => (
                            <span
                              key={i}
                              className="text-xs text-white bg-gray-800 bg-opacity-80 px-2 py-0.5 sm:py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <p className="text-gray-300 mb-4 text-sm sm:text-base">
                      {project.description}
                    </p>
                    <span className="inline-flex items-center text-yellow-500 font-medium text-sm sm:text-base group-hover:text-yellow-400">
                      View Project
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
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
                    </span>
                  </div>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
