import React, { useState } from "react";
import { motion } from "framer-motion";
import aboutData from "@/data/about.json";
import { TextReveal } from "./ui/TextReveal";
import { TechStack } from "./ui/TechStack";

export default function About() {
  const [tab, setTab] = useState("skills");

  const handleTabChange = (id) => {
    setTab(id);
  };

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case "skills":
        return (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pl-0">
            {aboutData.skills.map((skill, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="flex items-center gap-2 text-gray-300 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all group cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-yellow-500 group-hover:scale-150 transition-transform flex-shrink-0"></span>
                <span className="group-hover:text-yellow-400 transition-colors text-sm">{skill}</span>
              </motion.li>
            ))}
          </ul>
        );
      case "education":
        return (
          <div className="space-y-6">
            {aboutData.education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-yellow-500/50 transition-all"
              >
                <h4 className="text-yellow-500 font-semibold text-lg mb-2">{edu.degree}</h4>
                <p className="text-gray-300 mb-1">{edu.institution}</p>
                <div className="flex flex-wrap gap-3 items-center text-sm">
                  <span className="text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full">GPA {edu.gpa}</span>
                  <span className="text-gray-400">{edu.period}</span>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50"
            >
              <h4 className="text-yellow-500 font-semibold text-lg mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {aboutData.specializations.map((spec, index) => (
                  <span key={index} className="text-gray-300 bg-gray-900/50 px-3 py-1.5 rounded-full text-sm border border-gray-700">
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        );
      case "certifications":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {aboutData.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-yellow-500/5 hover:border-yellow-500/50 transition-all group"
              >
                <svg
                  className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
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
                <span className="text-gray-300 text-sm group-hover:text-yellow-400 transition-colors">{cert}</span>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className="bg-black-500 text-onyx py-12 sm:py-16 md:py-20 relative overflow-hidden"
      id="about"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-40 sm:w-60 h-40 sm:h-60 bg-yellow-500 rounded-full opacity-5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-40 sm:w-60 h-40 sm:h-60 bg-yellow-500 rounded-full opacity-5 blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <TextReveal>
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300 text-shadow-glow">
              About Me
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
          </div>
        </TextReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-1"
          >
            <div className="glass-morphism p-6 rounded-xl border border-gray-800 box-shadow-glow h-full">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-300 mb-4">
                {aboutData.title.split("passionate developer")[0]}
                <span className="text-yellow-500">passionate developer</span>
              </h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
                {aboutData.description.primary}
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {aboutData.description.secondary}
              </p>
              
              {/* Decorative element */}
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
                <div className="h-1 w-8 bg-yellow-500/50 rounded-full"></div>
                <div className="h-1 w-4 bg-yellow-500/30 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <div className="glass-morphism p-6 rounded-xl shadow-lg border border-gray-800 box-shadow-glow">
              <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mb-6 pb-4 border-b border-gray-800">
                {["skills", "education", "certifications"].map((tabId) => (
                  <button
                    key={tabId}
                    onClick={() => handleTabChange(tabId)}
                    className={`font-medium text-base sm:text-lg transition-all whitespace-nowrap relative mobile-touch-optimized px-4 py-2 rounded-lg ${
                      tab === tabId
                        ? "text-yellow-500 bg-yellow-500/10"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                    }`}
                  >
                    {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                  </button>
                ))}
              </div>
              <div className="min-h-[300px]">
                {renderTabContent(tab)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Scrolling Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-12 sm:mt-16"
        >
          <TechStack />
        </motion.div>
      </div>
    </section>
  );
}
