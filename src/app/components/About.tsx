import React, { useState } from "react";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import aboutData from "@/data/about.json";

export default function About() {
  const [tab, setTab] = useState("skills");

  const handleTabChange = (id) => {
    setTab(id);
  };

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case "skills":
        return (
          <ul className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 pl-0 sm:pl-2">
            {aboutData.skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-300">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                {skill}
              </li>
            ))}
          </ul>
        );
      case "education":
        return (
          <ul className="space-y-4">
            {aboutData.education.map((edu, index) => (
              <li key={index}>
                <div className="flex flex-col">
                  <span className="text-yellow-500 font-medium">{edu.degree}</span>
                  <span className="text-gray-300">{edu.institution} — GPA {edu.gpa}</span>
                  <p className="text-gray-400 text-sm mt-1">{edu.period}</p>
                </div>
              </li>
            ))}
            <li>
              <div className="flex flex-col">
                <span className="text-yellow-500 font-medium">Specializations</span>
                {aboutData.specializations.map((spec, index) => (
                  <span key={index} className="text-gray-300">{spec}</span>
                ))}
              </div>
            </li>
          </ul>
        );
      case "certifications":
        return (
          <ul className="space-y-2">
            {aboutData.certifications.map((cert, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-300">{cert}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className="bg-black-500 text-onyx py-12 sm:py-16 md:py-20"
      id="about"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
            About Me
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
        </motion.div>

        <div className="md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-8 md:mb-0"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-yellow-300 opacity-20 blur-xl rounded-3xl"></div>
              <div className="relative">
                <Image
                  src={aboutData.image}
                  alt="Profile Image"
                  width={500}
                  height={500}
                  className="rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-6 md:mt-0"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-300 mb-3 sm:mb-4">
              {aboutData.title.split("passionate developer")[0]}
              <span className="text-yellow-500">passionate developer</span>
            </h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              {aboutData.description.primary}
            </p>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              {aboutData.description.secondary}
            </p>

            <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-800">
              <div className="flex flex-wrap justify-start space-x-4 sm:space-x-6 mb-4 sm:mb-6 border-b border-gray-800 pb-3 sm:pb-4 overflow-x-auto">
                {["skills", "education", "certifications"].map((tabId) => (
                  <button
                    key={tabId}
                    onClick={() => handleTabChange(tabId)}
                    className={`font-medium text-base sm:text-lg transition-colors whitespace-nowrap ${
                      tab === tabId
                        ? "text-yellow-500"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                    {tab === tabId && (
                      <div className="h-0.5 bg-yellow-500 w-full mt-1"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="min-h-[180px] sm:min-h-[200px]">
                {renderTabContent(tab)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
