import type { Metadata } from "next";
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
      <h1 className="sr-only">Work and projects by {heroData.name}</h1>
      <div className="pt-24">
        <Projects showTopBorder={false} />
      </div>

      <Footer />
      <ThemeToggle />
    </main>
  );
}
