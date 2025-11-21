"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background text-text-tertiary border-t border-text-tertiary/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs uppercase tracking-widest">
          <span className="text-primary mr-2">©</span>
          2024 KTS_PORTFOLIO.SYSTEM
        </div>

        <div className="font-mono text-xs uppercase tracking-widest flex items-center gap-2">
          <span>STATUS:</span>
          <span className="text-primary animate-pulse">ONLINE</span>
        </div>

        <div className="font-mono text-xs text-text-tertiary/50">
          V.2.0.4 [STABLE]
        </div>
      </div>
    </footer>
  );
};

export default Footer;
