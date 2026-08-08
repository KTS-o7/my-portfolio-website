import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Script from "next/script";
import { LazyMotionWrapper } from "./components/ui/LazyMotionWrapper";
import { buildJsonLd, getProfileData, getSiteUrl } from "@/lib/profile";
import MarqueeStrip from "./components/home/MarqueeStrip";
import FeaturedExperience from "./components/home/FeaturedExperience";
import FeaturedProjects from "./components/home/FeaturedProjects";
import ValueSection from "./components/home/ValueSection";
import LatestWriting from "./components/home/LatestWriting";
import CtaSection from "./components/home/CtaSection";

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
      <main id="content" className="flex min-h-screen flex-col bg-background transition-colors duration-300">
        <Navbar />
        <Hero />
        <MarqueeStrip />
        <FeaturedExperience />
        <FeaturedProjects />
        <ValueSection />
        <LatestWriting />
        <CtaSection />
        <Footer />
      </main>
    </LazyMotionWrapper>
  );
}
