"use client";
import Link from "next/link";
import React, { useState, FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import heroData from "@/data/hero.json";

interface NAVLINK {
  title: string;
  homePath: string;
  routePath: string;
  external?: boolean;
}

const navLinks: NAVLINK[] = [
  {
    title: "Home",
    homePath: "#home",
    routePath: "/",
  },
  {
    title: "Experience",
    homePath: "#experience",
    routePath: "/work",
  },
  {
    title: "Projects",
    homePath: "#projects",
    routePath: "/projects",
  },
  {
    title: "Writing",
    homePath: "/publications",
    routePath: "/publications",
  },
  {
    title: "About",
    homePath: "#about",
    routePath: "/about",
  },
  {
    title: "Contact",
    homePath: "#contact",
    routePath: "/contact",
  },
  {
    title: "Links",
    homePath: "https://kts-o7.github.io/",
    routePath: "https://kts-o7.github.io/",
    external: true,
  },
];

const Navbar: FC = () => {
  const [navbarOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    if (!isHome) {
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }

    // Intersection Observer for active section highlighting (home page only)
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    const sections = ["home", "experience", "projects", "about", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isHome]);

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
          <Link href={"/"} className="group flex items-baseline gap-3">
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

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!navbarOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full border border-text-tertiary/25 bg-surface/60 text-text-secondary hover:text-text-primary hover:border-text-tertiary/45 focus:outline-none transition-all duration-300 mobile-touch-optimized min-w-[44px] min-h-[44px]"
              aria-label={navbarOpen ? "Close menu" : "Open menu"}
              aria-expanded={navbarOpen}
            >
              {!navbarOpen ? (
                <Bars3Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              ) : (
                <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </button>
          </div>

          <div className="hidden md:flex md:items-center space-x-7">
            {navLinks.map((link, index) => {
              const href = isHome ? link.homePath : link.routePath;

              const isAnchor = href.startsWith("#");
              const isActive = isHome
                ? isAnchor && activeSection === href.substring(1)
                : !link.external &&
                  (href === pathname ||
                    (href === "/work" && pathname.startsWith("/work")) ||
                    (href === "/projects" && pathname.startsWith("/projects")));

              return (
                <Link
                  key={index}
                  href={href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors link-underline ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile menu */}
        {navbarOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2 bg-background border-b border-text-tertiary/25">
              {navLinks.map((link, index) => {
                const href = isHome ? link.homePath : link.routePath;
                return (
                  <Link
                    key={index}
                    href={href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="block py-3 px-3 sm:px-4 text-text-secondary hover:bg-surface hover:text-text-primary font-mono text-sm transition-all duration-300 mobile-touch-optimized min-h-[44px] flex items-center uppercase tracking-wider"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
