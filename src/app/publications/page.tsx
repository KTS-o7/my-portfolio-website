import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroData from "@/data/hero.json";
import projectsData from "@/data/projects.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

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
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-12">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
          Writing & publications
        </h1>
        <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
          Selected publications and research work. For engineering work and
          projects, see{" "}
          <Link href="/projects" className="link-underline text-text-primary">
            selected work
          </Link>
          .
        </p>

        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((pub) => (
            <li
              key={pub.id}
              className="surface-card overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            >
              <a
                href={pub.links?.paper || pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col h-full"
              >
                <div className="relative h-44 border-b border-text-tertiary/20 overflow-hidden bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)]">
                  <Image
                    src={pub.image}
                    alt={`Cover image for ${pub.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                    {pub.name}
                  </h2>
                  <p className="mt-3 text-text-secondary text-sm leading-relaxed line-clamp-5 flex-grow">
                    {pub.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-text-tertiary/10 text-text-secondary font-mono text-xs uppercase tracking-widest">
                    Read paper
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
      <ThemeToggle />
    </main>
  );
}
