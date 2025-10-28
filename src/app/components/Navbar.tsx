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
      className={`fixed mx-auto top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-morphism shadow-lg border-b border-gray-800" : "bg-transparent"
      }`}
      style={{ isolation: "isolate" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link
          href={"/"}
          className="text-xl sm:text-2xl md:text-4xl text-yellow-500 font-bold tracking-tight hover:text-yellow-400 transition-all duration-300 hover:scale-110 text-shadow-glow"
        >
          KTS
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!navbarOpen)}
            className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-yellow-500 focus:outline-none transition-all duration-300 hover:scale-110 mobile-touch-optimized min-w-[44px] min-h-[44px]"
            aria-label="Toggle menu"
          >
            {!navbarOpen ? (
              <Bars3Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            )}
          </button>
        </div>

        <div className="hidden md:flex md:items-center space-x-1">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 text-gray-300 font-medium text-sm sm:text-md hover:text-yellow-500 transition-all duration-300 group"
            >
              {link.title}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {navbarOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2 glass-morphism border-t border-gray-800">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="block py-3 px-3 sm:px-4 text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500 rounded-lg font-medium text-base transition-all duration-300 mobile-touch-optimized min-h-[44px] flex items-center"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
