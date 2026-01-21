import Navbar from "./components/Navbar";
import dynamic from "next/dynamic";
import { SmoothScroll } from "./components/ui/SmoothScroll";
import { LazyMotionWrapper } from "./components/ui/LazyMotionWrapper";
import Script from "next/script";
import { buildJsonLd, getProfileData, getSiteUrl } from "@/lib/profile";

const HeroSection = dynamic(() => import("./components/Hero"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-background" />,
});
const AboutSection = dynamic(() => import("./components/About"), { ssr: true });
const ProjectsSection = dynamic(() => import("./components/Projects"), {
  ssr: true,
});
const EmailSection = dynamic(() => import("./components/Contact"), {
  ssr: true,
});
const Footer = dynamic(() => import("./components/Footer"), { ssr: true });
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { Cursor } from "./components/ui/Cursor";
import { SystemScrollBar } from "./components/ui/SystemScrollBar";

export default function Home() {
  const siteUrl = getSiteUrl();
  const profile = getProfileData(siteUrl);
  const jsonLd = buildJsonLd(profile, siteUrl);

  return (
    <LazyMotionWrapper>
      <Script
        id="portfolio-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background transition-colors duration-300">
        <SmoothScroll />
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
        <Cursor />
        <SystemScrollBar />
        <Analytics />
        <SpeedInsights />
      </main>
    </LazyMotionWrapper>
  );
}
