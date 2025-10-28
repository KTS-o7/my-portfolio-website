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
                className="flex items-center gap-2 text-text-secondary p-3 rounded-lg bg-surface border border-text-tertiary hover:bg-primary/10 hover:border-primary/50 transition-all group cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform flex-shrink-0"></span>
                <span className="group-hover:text-primary transition-colors text-sm">{skill}</span>
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
                className="p-4 rounded-lg bg-surface border border-text-tertiary hover:border-primary/50 transition-all"
              >
                <h4 className="text-primary font-semibold text-lg mb-2">{edu.degree}</h4>
                <p className="text-text-secondary mb-1">{edu.institution}</p>
                <div className="flex flex-wrap gap-3 items-center text-sm">
                  <span className="text-text-tertiary bg-background px-3 py-1 rounded-full">GPA {edu.gpa}</span>
                  <span className="text-text-tertiary">{edu.period}</span>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-4 rounded-lg bg-surface border border-text-tertiary"
            >
              <h4 className="text-primary font-semibold text-lg mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {aboutData.specializations.map((spec, index) => (
                  <span key={index} className="text-text-secondary bg-background px-3 py-1.5 rounded-full text-sm border border-text-tertiary">
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
                className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-text-tertiary hover:bg-primary/5 hover:border-primary/50 transition-all group"
              >
                <svg
                  className="h-5 w-5 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
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
                <span className="text-text-secondary text-sm group-hover:text-primary transition-colors">{cert}</span>
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
      className="bg-background py-12 sm:py-16 md:py-20 relative overflow-hidden"
      id="about"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-40 sm:w-60 h-40 sm:h-60 bg-primary rounded-full opacity-5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-40 sm:w-60 h-40 sm:h-60 bg-primary rounded-full opacity-5 blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <TextReveal>
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-shadow-glow">
              About Me
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
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
            <div className="glass-morphism p-6 rounded-xl border border-text-tertiary box-shadow-glow h-full">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">
                {aboutData.title.split("passionate developer")[0]}
                <span className="text-primary">passionate developer</span>
              </h3>
              <p className="text-text-secondary mb-4 text-sm sm:text-base leading-relaxed">
                {aboutData.description.primary}
              </p>
              <p className="text-text-tertiary text-sm sm:text-base leading-relaxed">
                {aboutData.description.secondary}
              </p>
              
              {/* Decorative element */}
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 w-12 bg-primary rounded-full"></div>
                <div className="h-1 w-8 bg-primary/50 rounded-full"></div>
                <div className="h-1 w-4 bg-primary/30 rounded-full"></div>
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
            <div className="glass-morphism p-6 rounded-xl shadow-lg border border-text-tertiary box-shadow-glow">
              <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mb-6 pb-4 border-b border-text-tertiary">
                {["skills", "education", "certifications"].map((tabId) => (
                  <button
                    key={tabId}
                    onClick={() => handleTabChange(tabId)}
                    className={`font-medium text-base sm:text-lg transition-all whitespace-nowrap relative mobile-touch-optimized px-4 py-2 rounded-lg ${
                      tab === tabId
                        ? "text-primary bg-primary/10"
                        : "text-text-tertiary hover:text-text-secondary hover:bg-surface"
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
