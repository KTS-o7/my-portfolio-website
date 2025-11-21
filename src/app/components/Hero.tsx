"use client";
import React, { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import heroData from "@/data/hero.json";
import { Spotlight } from "./ui/Spotlight";
import { AnimatedGrid } from "./ui/AnimatedGrid";

const Hero: FC = () => {
  const typeAnimationSequence = [];
  typeAnimationSequence.push(heroData.name, heroData.roleAnimationDelay);
  heroData.roles.forEach((role) => {
    typeAnimationSequence.push(role, heroData.roleAnimationDelay);
  });

  return (
    <section className="bg-background relative overflow-hidden min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              },
            }}
            className="flex flex-col justify-center"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex items-center space-x-2 mb-6"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary font-mono text-sm tracking-widest uppercase">System Online</span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]"
            >
              FULL<br />
              STACK<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ENGINEER</span>
            </motion.h1>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="border-l-2 border-primary/30 pl-6 mb-8"
            >
              <p className="text-text-secondary text-lg md:text-xl font-mono leading-relaxed">
                Leading <span className="text-white font-bold">Compliance OS</span> at OnFinance.
                <br />
                Architecting secure, scalable infrastructure for the future of fintech.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="flex flex-wrap gap-4"
            >
              {heroData.buttons.map((button, index) => {
                const isPrimary = button.type === "primary";
                return button.external ? (
                  <Link
                    key={index}
                    href={button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-4 font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 ${isPrimary
                      ? "bg-primary text-black hover:bg-white"
                      : "border border-text-tertiary text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                  >
                    {button.text}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={button.link}
                    className={`px-8 py-4 font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 ${isPrimary
                      ? "bg-primary text-black hover:bg-white"
                      : "border border-text-tertiary text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                  >
                    {button.text}
                  </a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column: Visual/Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Technical decorative elements */}
              <div className="absolute inset-0 border border-text-tertiary/20 rounded-full"></div>
              <div className="absolute inset-4 border border-text-tertiary/20 rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] relative overflow-hidden rounded-full grayscale hover:grayscale-0 transition-all duration-500 border-2 border-primary/50">
                  <Image
                    src={heroData.image}
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Floating tech badges */}
              <div className="absolute top-0 right-10 bg-surface border border-text-tertiary/30 px-4 py-2 rounded-none">
                <span className="text-primary font-mono text-xs">REACT.JS</span>
              </div>
              <div className="absolute bottom-20 left-0 bg-surface border border-text-tertiary/30 px-4 py-2 rounded-none">
                <span className="text-primary font-mono text-xs">NEXT.JS</span>
              </div>
              <div className="absolute bottom-0 right-20 bg-surface border border-text-tertiary/30 px-4 py-2 rounded-none">
                <span className="text-primary font-mono text-xs">NODE.JS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
