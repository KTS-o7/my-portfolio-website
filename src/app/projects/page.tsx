import type { Metadata } from "next";
import Link from "next/link";
import heroData from "@/data/hero.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Projects from "@/app/components/Projects";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { Cursor } from "@/app/components/ui/Cursor";
import { SystemScrollBar } from "@/app/components/ui/SystemScrollBar";

const title = `Work & Projects | ${heroData.name}`;
const description =
  "Projects, publications, and end-to-end work (discovery → development → deployment).";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title,
    description,
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-4">
        <h1 className="sr-only">
          Work and projects by {heroData.name}
        </h1>

        <section
          aria-labelledby="featured-work"
          className="border border-text-tertiary/20 bg-surface/30 p-6 sm:p-8 mb-8"
        >
          <h2
            id="featured-work"
            className="text-sm font-mono uppercase tracking-widest text-primary mb-4"
          >
            Featured_Work
          </h2>
          <p className="text-text-secondary font-mono mb-4">
            ComplianceOS is my primary end-to-end delivery at OnFinance AI.
          </p>
          <Link
            href="/work/complianceos"
            className="inline-flex items-center px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 bg-primary text-black hover:bg-white"
          >
            View_ComplianceOS
          </Link>
        </section>
      </div>

      <Projects />

      <Footer />
      <ThemeToggle />
      <Cursor />
      <SystemScrollBar />
    </main>
  );
}
