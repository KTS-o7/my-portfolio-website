import type { Metadata } from "next";
import Link from "next/link";
import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import About from "@/app/components/About";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { Cursor } from "@/app/components/ui/Cursor";
import { SystemScrollBar } from "@/app/components/ui/SystemScrollBar";

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
    <main className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-4">
        <h1 className="sr-only">
          About {heroData.name} — Founding-engineer style fullstack engineer
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
            Deep dive into my end-to-end, founding-engineer scope work on
            ComplianceOS.
          </p>
          <Link
            href="/work/complianceos"
            className="inline-flex items-center px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 bg-primary text-black hover:bg-white"
          >
            View_ComplianceOS
          </Link>
        </section>
      </div>

      <About />
      <Footer />
      <ThemeToggle />
      <Cursor />
      <SystemScrollBar />
    </main>
  );
}
