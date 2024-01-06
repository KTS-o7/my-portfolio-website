// pages/index.js

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  );
}
