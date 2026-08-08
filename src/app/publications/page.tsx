import Link from "next/link";
import projectsData from "@/data/projects.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { buildPageMetadata } from "@/lib/metadata";

const publications = projectsData.projects.filter((project) =>
  project.tag.includes("Publication"),
);

export const metadata = buildPageMetadata({
  title: "Publications",
  description:
    "Research publications and technical work by Krishnatejaswi Shenthar.",
  path: "/publications",
});

export default function PublicationsPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 pb-4">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Research
          </p>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            Writing &amp; publications
          </h1>
          <p className="mt-4 text-text-secondary max-w-[72ch] leading-relaxed">
            Selected publications and research work. For engineering work and
            projects, see{" "}
            <Link href="/projects" className="link-underline text-text-primary">
              selected work
            </Link>
            .
          </p>
        </div>

        <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-12">
          <ul className="mt-12">
            {publications.map((pub, index) => (
              <li key={pub.id} className="border-t border-border py-8 last:border-b">
                <a
                  href={pub.links?.paper || pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6"
                >
                  <span className="font-mono text-xs text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-semibold tracking-tight text-text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary">
                      {pub.name}
                    </span>
                    <span className="mt-3 block text-text-secondary text-sm leading-relaxed">
                      {pub.description}
                    </span>
                    <span className="mt-4 block text-text-secondary font-mono text-xs uppercase tracking-widest">
                      Read paper ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 border-t border-border">
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="btn btn-primary">
              View projects
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
