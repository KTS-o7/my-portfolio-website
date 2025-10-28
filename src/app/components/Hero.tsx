"use client";
import React, { FC } from "react";
import Image from "next/legacy/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import heroData from "@/data/hero.json";
import { Spotlight } from "./ui/Spotlight";
import { AnimatedGrid } from "./ui/AnimatedGrid";
import { FloatingParticles } from "./ui/FloatingParticles";

const Hero: FC = () => {
  const typeAnimationSequence = [];
  typeAnimationSequence.push(heroData.name, heroData.roleAnimationDelay);
  heroData.roles.forEach((role) => {
    typeAnimationSequence.push(role, heroData.roleAnimationDelay);
  });

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20 lg:py-32 relative overflow-hidden min-h-screen flex items-center">
      <Spotlight />
      <AnimatedGrid />
      <FloatingParticles count={40} />
      
      {/* Accent gradient in background */}
      <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-primary rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-primary rounded-full opacity-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-12 items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-full sm:col-span-7 md:col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-primary mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-shadow-glow">
            {heroData.title}
          </h1>
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-text-secondary">I&apos;m </span>
            <TypeAnimation
              sequence={typeAnimationSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-secondary"
            />
          </h2>
          <p className="text-text-secondary text-sm sm:text-base md:text-lg mb-4 sm:mb-6 lg:text-xl max-w-2xl">
            {heroData.shortDescription}
            <br className="hidden sm:block" />
            {heroData.shortDescriptionLine2}
          </p>
          <p className="text-text-tertiary text-sm sm:text-base md:text-lg mb-6 sm:mb-8 lg:text-xl max-w-3xl">
            {heroData.detailedDescription.intro}{" "}
            <span className="text-primary font-medium">
              {heroData.detailedDescription.technologies.join(", ")}
            </span>
            , and modern web development with{" "}
            <span className="text-primary font-medium">
              {heroData.detailedDescription.webDev}
            </span>
            . My expertise in{" "}
            <span className="text-primary font-medium">
              {heroData.detailedDescription.languages.join(" and ")}
            </span>{" "}
            {heroData.detailedDescription.outro}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start relative z-0">
            {heroData.buttons.map((button, index) => {
              const buttonClasses =
                button.type === "primary"
                  ? "px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-primary hover:bg-secondary text-background font-bold transition-all shadow-lg hover:shadow-primary/20 text-center cursor-pointer text-sm sm:text-base"
                  : button.type === "secondary"
                  ? "px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-primary hover:bg-primary/10 text-primary font-bold transition-all text-sm sm:text-base"
                  : "px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-text-tertiary hover:border-primary hover:bg-primary/10 text-text-secondary hover:text-primary font-bold transition-all text-sm sm:text-base";

              return button.external ? (
                <Link
                  key={index}
                  href={button.link}
                  className={buttonClasses}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {button.text}
                </Link>
              ) : (
                <a key={index} href={button.link} className={buttonClasses}>
                  {button.text}
                </a>
              );
            })}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="col-span-full sm:col-span-5 md:col-span-4 place-self-center mt-8 sm:mt-4 lg:mt-0"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="rounded-full bg-surface w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px] relative overflow-hidden border-4 border-text-tertiary group-hover:border-primary transition-all duration-500 box-shadow-glow">
              <Image
                src={heroData.image}
                alt="Profile photo"
                layout="fill"
                objectFit="cover"
                priority={true}
                className="hover:scale-110 transition-all duration-700"
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block z-20">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
