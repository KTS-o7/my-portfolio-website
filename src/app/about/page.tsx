import type { Metadata } from "next";
import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import About from "@/app/components/About";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { buildPageMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: aboutData.description?.primary || heroData.shortDescription,
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <About showTopBorder={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-text-tertiary/10">
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
            <Link href="/experience" className="btn btn-secondary">
              View experience
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <ThemeToggle />
    </main>
  );
}
