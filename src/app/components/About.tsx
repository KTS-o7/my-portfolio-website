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
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {aboutData.skills.map((skill, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="flex items-center gap-2 text-text-secondary p-2 border-l border-primary/30 hover:bg-primary/5 transition-all group cursor-default"
              >
                <span className="text-primary font-mono text-xs opacity-50 group-hover:opacity-100">&gt;</span>
                <span className="font-mono text-sm uppercase tracking-wider group-hover:text-primary transition-colors">{skill}</span>
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-l-2 border-text-tertiary pl-4 hover:border-primary transition-colors"
              >
                <h4 className="text-gray-900 dark:text-white font-bold text-lg font-mono uppercase">{edu.degree}</h4>
                <p className="text-primary font-mono text-sm mb-2">{edu.institution}</p>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-text-tertiary uppercase tracking-widest">
                  <span>GPA: {edu.gpa}</span>
                  <span>{"//"} {edu.period}</span>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-8 pt-6 border-t border-text-tertiary/20"
            >
              <h4 className="text-text-secondary font-mono text-sm uppercase tracking-widest mb-4">Specializations_</h4>
              <div className="flex flex-wrap gap-2">
                {aboutData.specializations.map((spec, index) => (
                  <span key={index} className="text-primary bg-primary/5 px-3 py-1 text-xs font-mono border border-primary/20">
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        );
      case "certifications":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutData.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 border border-text-tertiary/30 hover:border-primary/50 transition-all bg-surface/50"
              >
                <div className="mt-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-text-secondary font-mono text-sm uppercase tracking-wide">{cert}</span>
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
      className="bg-background py-20 sm:py-32 relative overflow-hidden border-t border-text-tertiary/10"
      id="about"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end gap-4 mb-4"
          >
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-text-tertiary/20 uppercase tracking-tighter leading-none">
              About
            </h2>
            <div className="h-px flex-grow bg-primary/30 mb-4"></div>
            <span className="font-mono text-primary text-sm mb-4">SYS.INFO</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="border-l-2 border-primary pl-6 py-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 font-mono uppercase">
                {aboutData.title}
              </h3>
              <p className="text-text-secondary mb-6 text-base sm:text-lg leading-relaxed font-light">
                {aboutData.description.primary}
              </p>
              <p className="text-text-tertiary text-sm sm:text-base leading-relaxed font-mono">
                &gt; {aboutData.description.secondary}
              </p>
            </div>

            {/* Decorative Tech Specs */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-text-tertiary/20 pt-8">
              <div>
                <span className="block text-xs font-mono text-text-tertiary uppercase mb-1">Location</span>
                <span className="text-gray-900 dark:text-white font-mono">Bangalore, IN</span>
              </div>
              <div>
                <span className="block text-xs font-mono text-text-tertiary uppercase mb-1">Status</span>
                <span className="text-primary font-mono animate-pulse">Available</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-surface border border-text-tertiary/20 p-1">
              <div className="flex border-b border-text-tertiary/20 bg-black/20">
                {["skills", "education", "certifications"].map((tabId) => (
                  <button
                    key={tabId}
                    onClick={() => handleTabChange(tabId)}
                    className={`px-6 py-3 font-mono text-xs sm:text-sm uppercase tracking-widest transition-all ${tab === tabId
                      ? "bg-primary text-black font-bold"
                      : "text-text-tertiary hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    {tabId}
                  </button>
                ))}
              </div>
              <div className="p-6 sm:p-8 min-h-[400px]">
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
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 border-t border-text-tertiary/10 pt-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-primary font-mono text-xs uppercase tracking-widest">Stack_Trace</span>
            <div className="h-px flex-grow bg-text-tertiary/20"></div>
          </div>
          <TechStack />
        </motion.div>
      </div>
    </section>
  );
}
