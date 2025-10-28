"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-black text-white border-t border-gray-800 overflow-hidden">
      <div className="absolute top-0 left-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-yellow-500 rounded-full opacity-5 blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 relative">
        <div className="border-t border-gray-800 mt-6 sm:mt-4 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; 2024 Krishnatejaswi S. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 md:mt-0">
            Built with <span className="text-yellow-500 animate-pulse">♥</span> using Next.js
            & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
