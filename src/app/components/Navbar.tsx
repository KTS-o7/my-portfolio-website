"use client";
import Link from "next/link";
import React, { useState, FC } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import heroData from "@/data/hero.json";
import { ThemeToggle } from "./ui/ThemeToggle";

interface NavLink {
  title: string;
  routePath: string;
}

const navLinks: NavLink[] = [
  { title: "Experience", routePath: "/experience" },
  { title: "Projects", routePath: "/projects" },
  { title: "Blog", routePath: "/blog" },
  { title: "About", routePath: "/about" },
  { title: "Publications", routePath: "/publications" },
  { title: "Contact", routePath: "/contact" },
];

const bookingUrl = (heroData as any).bookingUrl as string;

const Navbar: FC = () => {
  const [navbarOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
        style={{ isolation: "isolate" }}
        aria-label="Main Navigation"
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Wordmark */}
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-mono text-sm tracking-tight text-text-primary">
              {heroData.name}
            </span>
            <span className="hidden sm:block font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              / AI Engineer
            </span>
          </Link>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!navbarOpen)}
              className="inline-flex items-center justify-center p-2 text-text-secondary hover:text-text-primary focus:outline-none transition-colors mobile-touch-optimized min-w-[44px] min-h-[44px]"
              aria-label={navbarOpen ? "Close menu" : "Open menu"}
              aria-expanded={navbarOpen}
            >
              {navbarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
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
                    : "text-text-tertiary hover:text-text-primary"
                }`}
                aria-current={isActive(link.routePath) ? "page" : undefined}
              >
                {link.title}
              </Link>
            ))}

            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !min-h-0 py-2 px-4 text-xs"
            >
              Book a call
            </a>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu */}
        {navbarOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-4 py-2 bg-background">
              {navLinks.map((link) => (
                <Link
                  key={link.routePath}
                  href={link.routePath}
                  className={`flex items-center min-h-[44px] py-3 font-mono text-sm uppercase tracking-wider border-b border-border transition-colors mobile-touch-optimized ${
                    isActive(link.routePath)
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  aria-current={isActive(link.routePath) ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              <div className="py-3">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full justify-center"
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
