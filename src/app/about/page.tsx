import type { Metadata } from "next";
import Link from "next/link";
import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import About from "@/app/components/About";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

const title = `About | ${heroData.name}`;
const description = aboutData.description?.primary || heroData.shortDescription;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title,
    description,
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-4">
        <h1 className="sr-only">
          About {heroData.name} — Founding-engineer style fullstack engineer
        </h1>

        <section
          aria-labelledby="featured-work"
          className="surface-card p-6 sm:p-8 mb-8"
        >
          <h2 id="featured-work" className="pill w-fit">
            Featured work
          </h2>
          <p className="text-text-secondary mt-4 mb-6 max-w-[72ch] leading-relaxed">
            Deep dive into my end-to-end, founding-engineer scope work on
            ComplianceOS.
          </p>
          <Link href="/work/complianceos" className="btn btn-primary">
            View case study
          </Link>
        </section>
      </div>

      <About />
      <Footer />
      <ThemeToggle />
    </main>
  );
}
