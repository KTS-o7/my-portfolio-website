"use client";
import React from "react";
import Link from "next/link";
import contactData from "@/data/contact.json";

const Footer: React.FC = () => {
  const github = contactData.socialMedia?.find((item) => item.platform === "github")?.url;
  const twitter = contactData.socialMedia?.find((item) => item.platform === "twitter")?.url;
  const linkedin = contactData.socialMedia?.find((item) => item.platform === "linkedin")?.url;
  const bookingUrl = (contactData as any).bookingUrl as string | undefined;
  const resumeUrl = (contactData as any).resumeUrl as string | undefined;

  return (
    <footer className="bg-background border-t border-text-tertiary/20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left: identity */}
          <div className="flex-shrink-0">
            <div className="text-text-primary font-semibold tracking-tight">
              Krishnatejaswi Shenthar
            </div>
            <div className="mt-1 text-xs font-mono uppercase tracking-widest text-text-tertiary">
              Backend · Distributed · LLM tooling
            </div>
            <div className="mt-3 text-sm text-text-secondary max-w-[32ch]">
              Built with Next.js. Designed to communicate engineering craft and
              outcomes.
            </div>
          </div>

          {/* Middle: site nav */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-col gap-2 text-sm"
          >
          <span className="text-xs font-mono uppercase tracking-widest text-text-tertiary mb-1">
              Pages
            </span>
            <Link href="/experience" className="text-text-secondary hover:text-text-primary transition-colors">
              Experience
            </Link>
            <Link href="/projects" className="text-text-secondary hover:text-text-primary transition-colors">
              Projects
            </Link>
            <Link href="/about" className="text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors">
              Contact
            </Link>
            <Link href="/publications" className="text-text-secondary hover:text-text-primary transition-colors">
              Publications
            </Link>
          </nav>

          {/* Right: social + utility */}
          <nav
            aria-label="Footer links"
            className="flex flex-wrap gap-3"
          >
            {github && (
              <Link href={github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                GitHub
              </Link>
            )}
            {twitter && (
              <Link href={twitter} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Twitter
              </Link>
            )}
            {linkedin && (
              <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                LinkedIn
              </Link>
            )}
            <a href={`mailto:${contactData.email}`} className="btn btn-secondary">
              Email
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Resume ↗
              </a>
            )}
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Book a call
              </a>
            )}
          </nav>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 border-t border-text-tertiary/10 text-xs text-text-tertiary">
          © {new Date().getFullYear()} Krishnatejaswi Shenthar
        </div>
      </div>
    </footer>
  );
};

export default Footer;
