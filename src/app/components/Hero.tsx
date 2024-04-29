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
              className="text-gray-300"
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
            cutting-edge technologies such as{" "}
            <span className="text-yellow-500">
              Langchain, Ollama, Generative AI, JavaScript, Next.js, and machine
              learning libraries like PyTorch
            </span>
            . With a solid foundation in{" "}
            <span className="text-yellow-500">Python and C++</span>, I am not
            only proficient in programming but also adept at exploring and
            mastering new technologies. My journey is a testament to my
            dedication to continuous learning and my ability to adapt to the
            rapidly evolving landscape of technology. My portfolio showcases a
            range of
            <Link
              href="/#projects"
              className="text-yellow-500 hover:text-black hover:bg-yellow-500 font-bold px-2 py-2 rounded"
            >
              projects
            </Link>
            that reflect my versatility and commitment to innovation, making me
            a valuable asset to any team.
          </p>
          <div>
            <Link
              href="/#contact"
              className="px-6 inline-block py-4 mx-3 my-3 w-full sm:w-fit rounded-full mr-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              Contact Me
            </Link>
            <Link
              href="https://drive.google.com/file/d/1oxmvlLVVMBtA-GA50sitNZKWfGuE4wir/view?usp=drive_link"
              className="px-6 inline-block py-4 mx-3 my-3 w-full sm:w-fit rounded-full mr-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              Download CV
            </Link>
            <Link
              href="https://kts-o7.github.io/blog/"
              className="px-6 inline-block py-4 mx-3 my-3 w-full sm:w-fit rounded-full mr-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              BlogPost
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
