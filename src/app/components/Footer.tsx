"use client";
import React from "react";
import Link from "next/link";
import contactData from "@/data/contact.json";

const Footer: React.FC = () => {
  const github = contactData.socialMedia?.find(
    (item) => item.platform === "github",
  )?.url;
  const linkedin = contactData.socialMedia?.find(
    (item) => item.platform === "linkedin",
  )?.url;

  return (
    <footer className="bg-background text-text-tertiary border-t border-text-tertiary/20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="text-text-primary font-semibold tracking-tight">
            Krishna Tejaswi Shenthar
          </div>
          <div className="mt-1 text-xs font-mono uppercase tracking-widest text-text-tertiary">
            Backend systems · Distributed · LLM tooling
          </div>
          <div className="mt-3 text-sm text-text-secondary">
            Built with Next.js. Designed to communicate engineering craft and
            outcomes.
          </div>
        </div>

        <nav aria-label="Footer links" className="flex flex-wrap gap-3">
          {github && (
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              GitHub
            </Link>
          )}
          {linkedin && (
            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              LinkedIn
            </Link>
          )}
          <a href={`mailto:${contactData.email}`} className="btn btn-primary">
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
