import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import heroData from "@/data/hero.json";
import workData from "@/data/work.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { Cursor } from "@/app/components/ui/Cursor";
import { SystemScrollBar } from "@/app/components/ui/SystemScrollBar";
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
          <h1 className="text-2xl font-mono text-gray-900 dark:text-white">
            Work not found
          </h1>
          <p className="mt-4 text-text-secondary font-mono">
            This page is missing. Go back{" "}
            <Link href="/" className="text-primary hover:underline">
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
    <main className="flex min-h-screen flex-col bg-background transition-colors duration-300">
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

          <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
            {workItem.title}
          </h1>
          <p className="mt-4 text-text-secondary font-mono text-base sm:text-lg max-w-3xl">
            {workItem.subtitle}
          </p>
        </div>

        <section
          aria-labelledby="key-facts"
          className="border border-text-tertiary/20 bg-surface/30 p-6 sm:p-8 mb-10"
        >
          <h2
            id="key-facts"
            className="text-sm font-mono uppercase tracking-widest text-primary mb-6"
          >
            Key_Facts
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            <div>
              <dt className="text-xs uppercase tracking-widest text-text-tertiary">
                Role
              </dt>
              <dd className="mt-2 text-gray-900 dark:text-white">
                {workItem.role}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-text-tertiary">
                Company
              </dt>
              <dd className="mt-2">
                <a
                  href={workItem.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {workItem.company.name}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-text-tertiary">
                Base
              </dt>
              <dd className="mt-2 text-gray-900 dark:text-white">
                {workItem.location}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-text-tertiary">
                Open_To
              </dt>
              <dd className="mt-2 text-gray-900 dark:text-white">
                {workItem.openness}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="summary" className="mb-12">
          <h2
            id="summary"
            className="text-2xl font-bold text-gray-900 dark:text-white font-mono uppercase"
          >
            Summary
          </h2>
          <div className="mt-4 space-y-4 text-text-secondary leading-relaxed">
            {workItem.summary.map((paragraph) => (
              <p key={paragraph} className="font-mono">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="highlights" className="mb-12">
          <h2
            id="highlights"
            className="text-2xl font-bold text-gray-900 dark:text-white font-mono uppercase"
          >
            Highlights
          </h2>
          <ul className="mt-4 space-y-3 font-mono text-text-secondary">
            {workItem.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-primary opacity-60">&gt;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stack" className="mb-12">
          <h2
            id="stack"
            className="text-2xl font-bold text-gray-900 dark:text-white font-mono uppercase"
          >
            Stack
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {workItem.stack.map((item) => (
              <span
                key={item}
                className="text-primary bg-primary/5 px-3 py-1 text-xs font-mono border border-primary/20 uppercase tracking-widest"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section aria-labelledby="evidence" className="mb-12">
          <h2
            id="evidence"
            className="text-2xl font-bold text-gray-900 dark:text-white font-mono uppercase"
          >
            Evidence
          </h2>
          <ul className="mt-4 space-y-3 font-mono text-text-secondary">
            {workItem.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="notes"
          className="border border-text-tertiary/20 bg-surface/30 p-6 sm:p-8"
        >
          <h2
            id="notes"
            className="text-sm font-mono uppercase tracking-widest text-primary mb-4"
          >
            Notes
          </h2>
          <ul className="space-y-3 font-mono text-text-secondary text-sm">
            {workItem.notes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="text-primary opacity-60">!</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 bg-primary text-black hover:bg-white"
            >
              Contact_Me
            </Link>
          </div>
        </section>
      </div>

      <Footer />
      <ThemeToggle />
      <Cursor />
      <SystemScrollBar />
    </main>
  );
}
