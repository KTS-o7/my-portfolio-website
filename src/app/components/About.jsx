"use client";
import React, { useState } from "react";
import Image from "next/image";

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2 text-gray-300">
        <li>React</li>
        <li>Node.js</li>
        <li>Next.js</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2 text-gray-300">
        <li>Bachelor's in Computer Science - XYZ University</li>
        <li>Masters in Web Development - ABC Institute</li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2 text-gray-300">
        <li>Full Stack Web Development - Code Academy</li>
        <li>Advanced JavaScript - Udemy</li>
      </ul>
    ),
  },
];

export default function About() {
  const [tab, setTab] = useState("skills");

  const handleTabChange = (id) => {
    setTab(id);
  };

  return (
    <section className="bg-black-500 text-onyx" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image
          src="https://source.unsplash.com/random/300x300"
          alt="Your Name"
          width={500}
          height={500}
        />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-yellow-500 mb-4">About Me</h2>
          <p className="text-base lg:text-lg text-gray-300">
            I'm a web developer with a passion for coding and problem-solving. I
            specialize in building high-quality websites and applications using
            modern technologies like React, Node.js, and Next.js.
          </p>
          <div className="flex flex-row justify-start mt-8">
            {TAB_DATA.map((data) => (
              <button
                key={data.id}
                onClick={() => handleTabChange(data.id)}
                className={`mr-4 ${
                  tab === data.id ? "text-yellow-500" : "text-gray-500"
                }`}
              >
                {data.title}
              </button>
            ))}
          </div>
          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
}
