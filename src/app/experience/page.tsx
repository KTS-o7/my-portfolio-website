import type { Metadata } from "next";
import heroData from "@/data/hero.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Experience from "@/app/components/Experience";
import { LazyMotionWrapper } from "@/app/components/ui/LazyMotionWrapper";

const title = `Experience | ${heroData.name}`;
const description =
  "Work experience and shipped outcomes — grouped by company, with linked case studies and supporting projects.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/experience" },
  openGraph: {
    title,
    description,
    url: "/experience",
    type: "website",
  },
};

export default function ExperienceIndexPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">Experience</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            Roles &amp; outcomes
          </h1>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Company-by-company: scope, constraints, and shipped results.
          </p>
        </div>
        <LazyMotionWrapper>
          <Experience showTopBorder={false} showSeeMore={false} />
        </LazyMotionWrapper>
      </div>
      <Footer />
    </main>
  );
}
