import React, { useState, ReactElement } from "react";
import Image from "next/legacy/image";

interface TabData {
  title: string;
  id: string;
  content: ReactElement;
}
const TAB_DATA: TabData[] = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-5 text-gray-300 text-lg lg:text-2xl">
        <li>Python</li>
        <li>C++</li>
        <li>Langchain</li>
        <li>SQL</li>
        <li>React</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-5 text-gray-300 text-lg lg:text-2xl">
        <li>CS Engineering - RVCE, Bangalore</li>
        <li> GPA 9.50 </li>
        <li> Algorithms </li>
        <li> DBMS </li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-5 text-gray-300 text-lg lg:text-2xl">
        <li>Introduction to Soft Computing, NPTEL</li>
        <li>Datascience for Engineers, NPTEL</li>
        <li>Python for Everybody specialization, Coursera</li>
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
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16 rou">
        <Image
          src="/Images/3dlaptop.jpg"
          alt="Your Name"
          width={500}
          height={500}
          className="rounded-3xl"
        />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-gray-300 mb-4">About Me</h2>
          <p className="text-lg lg:text-2xl text-gray-300">
            I&apos;m a developer with a passion for coding and problem-solving.
            I specialize in building high-quality software solutions and
            applications using modern technologies like Langchain, Streamlit,
            and Next.js. I have obtained Gold+Elite Certification in Soft
            Computing and Data Science, offered by NPTEL.
          </p>
          <div className="flex flex-row justify-start mt-8">
            {TAB_DATA.map((data) => (
              <button
                key={data.id}
                onClick={() => handleTabChange(data.id)}
                className={`mr-4 font-bold text-lg lg:text-2xl ${
                  tab === data.id ? "text-yellow-500" : "text-gray-500"
                }`}
              >
                {data.title}
              </button>
            ))}
          </div>
          <div className="mt-8 ">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
}
