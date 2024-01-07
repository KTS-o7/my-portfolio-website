import React from "react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="bg-fixed bg-cover bg-no-repeat bg-center bg-opacity-75 min-h-screen"
      style={{
        backgroundImage: `url("https://source.unsplash.com/random/1600x900")`,
      }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-opacity-75 min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <img
                className="w-64 h-64 rounded-full shadow-lg"
                src="https://source.unsplash.com/random/300x300"
                alt="Profile photo"
              />
            </div>
            <div className="w-full md:w-1/2 px-4">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to My Portfolio
              </h1>
              <p className="text-xl mx-auto max-w-2xl">
                I'm a web developer with a passion for coding and
                problem-solving.
              </p>
              <div className="mt-8">
                <a
                  href="#contact"
                  className="bg-white text-blue-500 py-2 px-4 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition duration-300"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
