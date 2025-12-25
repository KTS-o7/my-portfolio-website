"use client";
// pages/index.js
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./components/Hero"), {
    ssr: true,
    loading: () => <div className="min-h-screen bg-background" />,
});
const AboutSection = dynamic(() => import("./components/About"), { ssr: true });
const ProjectsSection = dynamic(() => import("./components/Projects"), { ssr: true });
const EmailSection = dynamic(() => import("./components/Contact"), { ssr: true });
const Footer = dynamic(() => import("./components/Footer"), { ssr: true });
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeToggle } from "./components/ui/ThemeToggle";

export default function Home() {
    useEffect(() => {
        // Enable native smooth scrolling for the entire document
        document.documentElement.style.scrollBehavior = "smooth";

        // Smooth scroll functionality for hash links
        const handleSmoothScroll = (e: Event) => {
            // Only process hash links that point to sections on this page
            const target = e.currentTarget as HTMLAnchorElement;
            const href = target.getAttribute("href");

            if (!href?.startsWith("#") && !href?.startsWith("/#")) return;

            e.preventDefault();

            // Get the target ID, handling both "#section" and "/#section" formats
            const targetId = href.includes("/#")
                ? href.substring(2)
                : href.substring(1);

            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset to account for the navbar
                    behavior: "smooth",
                });

                // Update the URL without scrolling
                window.history.pushState(null, "", href);
            }
        };

        // Apply to all hash links across the site
        const hashLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
        hashLinks.forEach((link) => {
            link.addEventListener("click", handleSmoothScroll);
        });

        return () => {
            // Clean up event listeners and CSS
            document.documentElement.style.scrollBehavior = "";
            hashLinks.forEach((link) => {
                link.removeEventListener("click", handleSmoothScroll);
            });
        };
    }, []);

    return (
        <LazyMotion features={domAnimation}>
            <main className="flex min-h-screen flex-col bg-background transition-colors duration-300">
                <Navbar />
                <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-4">
                    <section id="hero" className="scroll-mt-24">
                        <HeroSection />
                    </section>
                    <section id="about" className="scroll-mt-24">
                        <AboutSection />
                    </section>
                    <section id="projects" className="scroll-mt-24">
                        <ProjectsSection />
                    </section>
                    <section id="contact" className="scroll-mt-24">
                        <EmailSection />
                    </section>
                </div>
                <Footer />
                <ThemeToggle />
                <Analytics />
                <SpeedInsights />
            </main>
        </LazyMotion>
    );
}
