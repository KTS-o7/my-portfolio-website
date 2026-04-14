"use client";
import Link from "next/link";
import React, { useState, FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import heroData from "@/data/hero.json";

interface NavLink {
  title: string;
  routePath: string;
}

const navLinks: NavLink[] = [
  { title: "Home", routePath: "/" },
  { title: "Experience", routePath: "/experience" },
  { title: "Projects", routePath: "/projects" },
  { title: "About", routePath: "/about" },
  { title: "Contact", routePath: "/contact" },
];

const bookingUrl = (heroData as any).bookingUrl as string;
const resumeUrl = (heroData as any).resumeUrl as string;

const Navbar: FC = () => {
  const [navbarOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (routePath: string) => {
    if (routePath === "/") return pathname === "/";
    return pathname === routePath || pathname.startsWith(routePath + "/");
  };

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <nav
        className={`fixed mx-auto top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 border-b border-text-tertiary/25 backdrop-blur-md"
            : "bg-transparent"
        }`}
        style={{ isolation: "isolate" }}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-text-tertiary/30 bg-surface/60 text-text-primary font-semibold">
              K
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors">
                {heroData.name}
              </span>
              <span className="hidden sm:block text-[11px] font-mono uppercase tracking-widest text-text-tertiary">
                Backend · Distributed · LLM tooling
              </span>
            </span>
          </Link>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!navbarOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full border border-text-tertiary/25 bg-surface/60 text-text-secondary hover:text-text-primary hover:border-text-tertiary/45 focus:outline-none transition-all duration-300 mobile-touch-optimized min-w-[44px] min-h-[44px]"
              aria-label={navbarOpen ? "Close menu" : "Open menu"}
              aria-expanded={navbarOpen}
            >
              {navbarOpen ? (
                <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              ) : (
                <Bars3Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.routePath}
                href={link.routePath}
                className={`font-mono text-xs uppercase tracking-widest transition-colors link-underline ${
                  isActive(link.routePath)
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                aria-current={isActive(link.routePath) ? "page" : undefined}
              >
                {link.title}
              </Link>
            ))}

            <div className="flex items-center gap-2 ml-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary text-xs py-1.5 px-3"
              >
                Resume
              </a>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-xs py-1.5 px-3"
              >
                Book a call
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {navbarOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2 bg-background border-b border-text-tertiary/25">
              {navLinks.map((link) => (
                <Link
                  key={link.routePath}
                  href={link.routePath}
                  className={`block py-3 px-3 sm:px-4 font-mono text-sm transition-all duration-300 mobile-touch-optimized min-h-[44px] flex items-center uppercase tracking-wider ${
                    isActive(link.routePath)
                      ? "text-text-primary bg-surface"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }`}
                  aria-current={isActive(link.routePath) ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              ))}

              <div className="flex gap-2 pt-2 px-3">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-sm flex-1 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Resume
                </a>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-sm flex-1 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Book a call
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
