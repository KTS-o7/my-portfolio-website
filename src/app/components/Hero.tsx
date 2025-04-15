"use client";
import React, { FC } from "react";
import Image from "next/legacy/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero: FC = () => {
  return (
    <section className="bg-black-500 py-12 sm:py-16 md:py-20 lg:py-32 relative overflow-hidden">
      {/* Yellow accent gradient in background */}
      <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-full sm:col-span-7 md:col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-yellow-500 mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight">
            Welcome to My Portfolio
          </h1>
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-gray-300">I'm </span>
            <TypeAnimation
              sequence={[
                "KTS-o7",
                1000,
                "a Developer",
                1000,
                "a Problem Solver",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-yellow-400"
            />
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 lg:text-xl max-w-2xl">
            SDE Intern @ RingCentral India | Senior Core Member @ Coding Club
            RVCE | Senior @ Dept of CSE, RVCE.
            <br className="hidden sm:block" />A passionate developer
            specializing in Generative AI, Langchain, Python, and modern web
            technologies.
          </p>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 lg:text-xl max-w-3xl">
            As a Computer Science and Engineering student from Bangalore, India,
            I'm passionate about{" "}
            <span className="text-yellow-500 font-medium">
              Mirascope, Groq, Ollama, Generative AI
            </span>
            , and modern web development with{" "}
            <span className="text-yellow-500 font-medium">Next.js</span>. My
            expertise in{" "}
            <span className="text-yellow-500 font-medium">Python and C++</span>{" "}
            allows me to build innovative solutions across different domains.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start relative z-0">
            <a
              href="#contact"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-all shadow-lg hover:shadow-yellow-500/20 text-center cursor-pointer text-sm sm:text-base"
            >
              Contact Me
            </a>
            <Link
              href="https://drive.google.com/file/d/1oxmvlLVVMBtA-GA50sitNZKWfGuE4wir/view?usp=drive_link"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-yellow-500 hover:bg-yellow-500/10 text-yellow-500 font-bold transition-all text-sm sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </Link>
            <Link
              href="https://kts-o7.github.io/blog/"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-gray-600 hover:border-yellow-500 hover:bg-yellow-500/10 text-gray-300 hover:text-yellow-500 font-bold transition-all text-sm sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Blog
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="col-span-full sm:col-span-5 md:col-span-4 place-self-center mt-8 sm:mt-4 lg:mt-0"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 opacity-70 blur-sm"></div>
            <div className="rounded-full bg-gray-800 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px] relative overflow-hidden border-4 border-gray-700">
              <Image
                src="/Hero.png"
                alt="Profile photo"
                layout="fill"
                objectFit="cover"
                priority={true}
                className="hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
