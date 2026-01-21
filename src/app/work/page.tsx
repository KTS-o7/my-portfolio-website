import type { Metadata } from "next";
import heroData from "@/data/hero.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Experience from "@/app/components/Experience";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

const title = `Experience | ${heroData.name}`;
const description =
  "Work experience and shipped outcomes — grouped by company, with linked case studies and supporting projects.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    title,
    description,
    url: "/work",
    type: "website",
  },
};

export default function WorkIndexPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <Experience showTopBorder={false} showSeeMore={false} />
      </div>
      <Footer />
      <ThemeToggle />
    </main>
  );
}
