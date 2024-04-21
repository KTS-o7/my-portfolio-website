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
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };
  return (
    <section id="projects" className="py-12 px-4 bg-black text-gray-200">
      <h2 className="text-4xl mb-8 text-center font-semibold">
        Projects and Publications
      </h2>
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
        <button
          onClick={() => handleTagChange("Publication")}
          className={`px-3 py-2 rounded-md text-base font-lg lg:text-2xl ${
            tag === "Publication"
              ? "text-black bg-yellow-500"
              : "text-yellow-500 bg-black"
          }`}
        >
          Publication
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
              <Image
                className="w-full h-56 object-cover"
                src={project.image}
                alt={project.name}
                width={500} // Example width, adjust as needed
                height={300} // Example height, adjust as needed
                //layout="full" // Maintains aspect ratio
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
                    href={project.link}
                    className="text-yellow-500 hover:underline"
                  >
                    Click Me to Explore !
                  </a>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default Projects;
