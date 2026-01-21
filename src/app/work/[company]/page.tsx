import type { Metadata } from "next";
import Link from "next/link";
import heroData from "@/data/hero.json";
import experienceData from "@/data/experience.json";
import projectsData from "@/data/projects.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

type ExperienceEntry = {
  slug: string;
  company: { name: string; url?: string };
  role: string;
  type?: string;
  location?: string;
  timeframe?: string;
  summary?: string;
  highlights?: string[];
  skills?: string[];
  caseStudies?: { title: string; href: string }[];
  selectedProjectIds?: number[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const entry = (experienceData.experience as ExperienceEntry[]).find(
    (item) => item.slug === company,
  );

  const title = entry
    ? `${entry.company.name} | Experience | ${heroData.name}`
    : `Experience | ${heroData.name}`;
  const description =
    entry?.summary ||
    "Work experience, outcomes, and supporting projects grouped by company.";

  return {
    title,
    description,
    alternates: { canonical: `/work/${company}` },
    openGraph: {
      title,
      description,
      url: `/work/${company}`,
      type: "profile",
    },
  };
}

export default async function CompanyExperiencePage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const entry = (experienceData.experience as ExperienceEntry[]).find(
    (item) => item.slug === company,
  );

  if (!entry) {
    return (
      <main id="content" className="min-h-screen bg-background">
        <Navbar />
        <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Experience not found
          </h1>
          <p className="mt-4 text-text-secondary">
            This page doesn’t exist. Go back to{" "}
            <Link href="/work" className="link-underline text-text-primary">
              experience
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  const selectedProjects = (entry.selectedProjectIds || [])
    .map((id) => projectsData.projects.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-10">
        <div className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          <Link href="/" className="link-underline text-text-primary">
            Home
          </Link>{" "}
          <span className="mx-2">/</span>
          <Link href="/work" className="link-underline text-text-primary">
            Experience
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{entry.company.name}</span>
        </div>

        <header className="mt-6">
          <span className="pill w-fit">{entry.type || "Experience"}</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {entry.company.name}
          </h1>
          <p className="mt-3 text-text-secondary text-base sm:text-lg leading-relaxed max-w-[72ch]">
            {entry.role}
            {entry.timeframe ? ` · ${entry.timeframe}` : ""}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          {entry.summary && (
            <p className="mt-5 text-text-secondary leading-relaxed max-w-[80ch]">
              {entry.summary}
            </p>
          )}
        </header>

        {Array.isArray(entry.highlights) && entry.highlights.length > 0 && (
          <section className="mt-10 surface-card p-6 sm:p-8">
            <h2 className="pill w-fit">Highlights</h2>
            <ul className="mt-5 space-y-2 text-text-secondary">
              {entry.highlights.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {Array.isArray(entry.skills) && entry.skills.length > 0 && (
          <section className="mt-6 surface-card p-6 sm:p-8">
            <h2 className="pill w-fit">Stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.skills.map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(entry.caseStudies) && entry.caseStudies.length > 0 && (
          <section className="mt-6 surface-card p-6 sm:p-8">
            <h2 className="pill w-fit">Case studies</h2>
            <div className="mt-5 space-y-3">
              {entry.caseStudies.map((cs) => (
                <Link
                  key={cs.href}
                  href={cs.href}
                  className="btn btn-primary w-fit"
                >
                  {cs.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {selectedProjects.length > 0 && (
          <section className="mt-6 surface-card p-6 sm:p-8">
            <h2 className="pill w-fit">Selected projects</h2>
            <ul className="mt-6 space-y-4">
              {selectedProjects.map((project) => (
                <li key={project.id}>
                  <div className="rounded-[14px] border border-[var(--border)] p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold tracking-tight text-text-primary">
                          {project.name}
                        </div>
                        <div className="mt-2 text-text-secondary leading-relaxed">
                          {project.description}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(project.tech || []).slice(0, 6).map((t: string) => (
                          <span key={t} className="pill">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {(project.links?.demo || project.links?.paper) && (
                        <a
                          href={project.links?.demo || project.links?.paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Open
                        </a>
                      )}
                      <a
                        href={project.links?.source || project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        Source
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <div className="flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-secondary">
              Back to experience
            </Link>
            {entry.company?.url && (
              <a
                href={entry.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Company site
              </a>
            )}
            <Link href="/contact" className="btn btn-primary">
              Contact
            </Link>
          </div>
        </section>
      </div>

      <Footer />
      <ThemeToggle />
    </main>
  );
}
