"use client";
import React, { FC } from "react";
import Image from "next/legacy/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero: FC = () => {
  return (
    <section className="bg-black-500 lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-yellow-500 mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
            Welcome to My Portfolio
          </h1>
          <h1 className=" mb-4 text-4xl sm:text-2xl lg:text-8xl lg:leading-normal font-extrabold">
            <TypeAnimation
              sequence={[
                "KTS-o7",
                1000,
                "Developer",
                1000,
                "Problem Solver",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-white"
            />
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-6 lg:text-xl font-semibold ">
            I&apos;m a developer with a passion for coding and problem-solving.
          </p>
          <p className="text-gray-300 text-base sm:text-lg mb-6 lg:text-xl font-semibold">
            President of Coding Club RVCE, Junior @ Dept of CSE,RVCE.
          </p>
          <p className="text-gray-300 text-base sm:text-lg mb-6 lg:text-xl">
            As a Computer Science and Engineering student from Bangalore, India,
            I am a passionate learner and innovator, with a keen interest in
            cutting-edge technologies such as Langchain, Ollama, Generative AI,
            JavaScript, Next.js, and machine learning libraries like PyTorch.
            With a solid foundation in Python and C++, I am not only proficient
            in programming but also adept at exploring and mastering new
            technologies. My journey is a testament to my dedication to
            continuous learning and my ability to adapt to the rapidly evolving
            landscape of technology. My portfolio showcases a range of{" "}
            <Link
              href="/#projects"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              projects
            </Link>{" "}
            that reflect my versatility and commitment to innovation, making me
            a valuable asset to any team.
          </p>
          <div>
            <Link
              href="/#contact"
              className="px-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              Contact Me
            </Link>
            <Link
              href="https://drive.google.com/file/d/1oxmvlLVVMBtA-GA50sitNZKWfGuE4wir/view?usp=drive_link"
              className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-3"
            >
              <span className="block rounded-full px-5 py-2">Download CV</span>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 place-self-center mt-4 lg:mt-0"
        >
          <div className="rounded-full bg-gray-700 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] relative overflow-hidden">
            <Image
              src="/heroImg.png"
              alt="Profile photo"
              layout="fill"
              objectFit="cover"
              priority={true}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
