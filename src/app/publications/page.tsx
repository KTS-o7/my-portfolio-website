import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroData from "@/data/hero.json";
import projectsData from "@/data/projects.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { Cursor } from "@/app/components/ui/Cursor";
import { SystemScrollBar } from "@/app/components/ui/SystemScrollBar";

const publications = projectsData.projects.filter((project) =>
  project.tag.includes("Publication"),
);

const title = `Publications | ${heroData.name}`;
const description =
  "Research publications and technical work by Krishna Tejaswi Shenthar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/publications" },
  openGraph: {
    title,
    description,
    url: "/publications",
    type: "website",
  },
};

export default function PublicationsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-12">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
          Publications
        </h1>
        <p className="mt-4 text-text-secondary font-mono max-w-3xl">
          Selected publications and research work. For engineering work and
          projects, see{" "}
          <Link href="/projects" className="text-primary hover:underline">
            Work
          </Link>
          .
        </p>

        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publications.map((pub) => (
            <li
              key={pub.id}
              className="bg-surface border border-text-tertiary/30 hover:border-primary transition-all duration-300 relative overflow-hidden"
            >
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col h-full"
              >
                <div className="relative h-44 border-b border-text-tertiary/20 overflow-hidden">
                  <Image
                    src={pub.image}
                    alt={`Cover image for ${pub.name}`}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white font-mono uppercase">
                    {pub.name}
                  </h2>
                  <p className="mt-3 text-text-secondary text-sm font-mono leading-relaxed line-clamp-4 flex-grow">
                    {pub.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-text-tertiary/10 text-primary font-mono text-xs uppercase tracking-widest">
                    View_Paper
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
      <ThemeToggle />
      <Cursor />
      <SystemScrollBar />
    </main>
  );
}
