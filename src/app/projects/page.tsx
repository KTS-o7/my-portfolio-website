import type { Metadata } from "next";
import Link from "next/link";
import heroData from "@/data/hero.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Projects from "@/app/components/Projects";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

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
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-4">
        <h1 className="sr-only">Work and projects by {heroData.name}</h1>

        <section
          aria-labelledby="featured-work"
          className="surface-card p-6 sm:p-8 mb-8"
        >
          <h2 id="featured-work" className="pill w-fit">
            Featured work
          </h2>
          <p className="text-text-secondary mt-4 mb-6 max-w-[72ch] leading-relaxed">
            ComplianceOS is my primary end-to-end delivery at OnFinance AI.
          </p>
          <Link href="/work/complianceos" className="btn btn-primary">
            View case study
          </Link>
        </section>
      </div>

      <Projects />

      <Footer />
      <ThemeToggle />
    </main>
  );
}
