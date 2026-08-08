import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Projects from "@/app/components/Projects";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Work & Projects",
  description:
    "Projects, publications, and end-to-end work — discovery to deployment.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">Work</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            Selected projects
          </h1>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Each project is framed as a short case study: the problem, the
            approach, and the measurable impact.
          </p>
        </div>
        <Projects showTopBorder={false} />
      </div>
      <Footer />
    </main>
  );
}
