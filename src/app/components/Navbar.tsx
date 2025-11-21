"use client";
import Link from "next/link";
import React, { useState, FC, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface NAVLINK {
  title: string;
  path: string;
}

const navLinks: NAVLINK[] = [
  {
    title: "Home",
    path: "#",
  },
  {
    title: "About",
    path: "#about",
  },
  {
    title: "Projects",
    path: "#projects",
  },
  {
    title: "Contact",
    path: "#contact",
  },
  {
    title: "LinkTree",
    path: "https://kts-o7.github.io/",
  },
];

const Navbar: FC = () => {
  const [navbarOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed mx-auto top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 border-b border-primary/20 backdrop-blur-sm" : "bg-transparent"
        }`}
      style={{ isolation: "isolate" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link
          href={"/"}
          className="text-xl sm:text-2xl font-mono font-bold tracking-tighter text-primary hover:text-accent transition-colors duration-300"
        >
          KTS_PORTFOLIO
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!navbarOpen)}
            className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-text-secondary hover:text-primary focus:outline-none transition-all duration-300 mobile-touch-optimized min-w-[44px] min-h-[44px]"
            aria-label="Toggle menu"
          >
            {!navbarOpen ? (
              <Bars3Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            )}
          </button>
        </div>

        <div className="hidden md:flex md:items-center space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className="relative text-text-secondary font-mono text-sm hover:text-primary transition-all duration-300 uppercase tracking-widest group"
            >
              <span className="text-primary/50 mr-1">0{index + 1}.</span>
              {link.title}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {navbarOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2 bg-background border-b border-primary/20">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                className="block py-3 px-3 sm:px-4 text-text-secondary hover:bg-surface hover:text-primary font-mono text-base transition-all duration-300 mobile-touch-optimized min-h-[44px] flex items-center uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-primary/50 mr-2">0{index + 1}.</span>
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
