"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">{/* Your logo */}</div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  About
                </a>
                <a
                  href="#projects"
                  className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {/* Menu open: "hidden", Menu closed: "block" */}
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open. */}
              {/* Menu open: "block", Menu closed: "hidden" */}
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-white hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-white hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            About
          </a>
          <a
            href="#projects"
            className="text-white hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-white hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}