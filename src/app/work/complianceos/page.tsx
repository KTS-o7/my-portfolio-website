import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import heroData from "@/data/hero.json";
import workData from "@/data/work.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { getSiteUrl } from "@/lib/profile";

const pagePath = "/work/complianceos";

const workItem = workData.work.find((item) => item.slug === "complianceos");

const title = `ComplianceOS — End-to-end Work | ${heroData.name}`;
const description =
  "Founding-engineer style deep dive: discovery → architecture → development → deployment for ComplianceOS (OnFinance AI), with agentic workflows (LangGraph + LiteLLM) for compliance automation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pagePath },
  openGraph: {
    title,
    description,
    url: pagePath,
    type: "article",
  },
};

export default function ComplianceOsPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${pagePath}`;

  if (!workItem) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Work not found
          </h1>
          <p className="mt-4 text-text-secondary">
            This page is missing. Go back{" "}
            <Link href="/" className="link-underline text-text-primary">
              home
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    about: [
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#work`,
        name: workItem.title,
        description: workItem.summary.join(" "),
        url: pageUrl,
        creator: {
          "@type": "Person",
          name: heroData.name,
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: workItem.company.name,
          url: "https://www.onfinance.ai",
        },
        keywords: [
          "compliance automation",
          "BFSI",
          "agentic workflows",
          "LangGraph",
          "LiteLLM",
        ],
        inLanguage: "en",
      },
    ],
  };

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Script
        id="complianceos-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-8 md:px-12 py-12">
        <div className="mb-10">
          <div className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>{" "}
            <span className="mx-2">/</span>
            <Link
              href="/projects"
              className="hover:text-primary transition-colors"
            >
              Work
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-primary">{workItem.title}</span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {workItem.title}
          </h1>
          <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-3xl leading-relaxed">
            {workItem.subtitle}
          </p>
        </div>

        <section
          aria-labelledby="key-facts"
          className="surface-card p-6 sm:p-8 mb-10"
        >
          <h2 id="key-facts" className="pill w-fit">
            Key facts
          </h2>
          <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Role
              </dt>
              <dd className="mt-2 text-text-primary">{workItem.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Company
              </dt>
              <dd className="mt-2">
                <a
                  href={workItem.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-text-primary"
                >
                  {workItem.company.name}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Base
              </dt>
              <dd className="mt-2 text-text-primary">{workItem.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Open_To
              </dt>
              <dd className="mt-2 text-text-primary">{workItem.openness}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="summary" className="mb-12">
          <h2
            id="summary"
            className="text-2xl font-semibold tracking-tight text-text-primary"
          >
            Summary
          </h2>
          <div className="mt-4 space-y-4 text-text-secondary leading-relaxed">
            {workItem.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="highlights" className="mb-12">
          <h2
            id="highlights"
            className="text-2xl font-semibold tracking-tight text-text-primary"
          >
            Highlights
          </h2>
          <ul className="mt-4 space-y-3 text-text-secondary">
            {workItem.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-primary opacity-60">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stack" className="mb-12">
          <h2
            id="stack"
            className="text-2xl font-semibold tracking-tight text-text-primary"
          >
            Stack
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {workItem.stack.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section aria-labelledby="evidence" className="mb-12">
          <h2
            id="evidence"
            className="text-2xl font-semibold tracking-tight text-text-primary"
          >
            Evidence
          </h2>
          <ul className="mt-4 space-y-3 text-text-secondary">
            {workItem.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="notes" className="surface-card p-6 sm:p-8">
          <h2 id="notes" className="pill w-fit">
            Notes
          </h2>
          <ul className="mt-4 space-y-3 text-text-secondary text-sm">
            {workItem.notes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="text-primary opacity-60">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
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
