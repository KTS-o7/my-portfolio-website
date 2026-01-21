import type { Metadata } from "next";
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
      <h1 className="sr-only">
        About {heroData.name} — Backend systems & LLM tooling engineer
      </h1>
      <div className="pt-24">
        <About showTopBorder={false} />
      </div>
      <Footer />
      <ThemeToggle />
    </main>
  );
}
