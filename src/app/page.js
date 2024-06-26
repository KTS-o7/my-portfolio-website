"use client";
// pages/index.js
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/Hero";
import AboutSection from "./components/About";
import ProjectsSection from "./components/Projects";
import EmailSection from "./components/Contact";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this code block runs only in the browser
      const SmoothScroll = require("smooth-scroll");
      let scroll = new SmoothScroll('a[href*="#"]', {
        speed: 500,
        speedAsDuration: true,
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="container mt-24 mx-auto px-12 py-4">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="contact">
          <EmailSection />
        </section>
      </div>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </main>
  );
}
