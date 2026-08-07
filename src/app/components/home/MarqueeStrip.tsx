"use client";
import React from "react";
import techData from "@/data/technologies.json";

// Slow, subtle marquee strip of the core toolbox. Pauses on reduced motion
// via the global prefers-reduced-motion rule in globals.css.
export default function MarqueeStrip() {
  const items = techData.technologies.map((tech) => tech.name);
  const doubled = [...items, ...items];

  return (
    <section
      aria-label="Toolbox"
      className="bg-background border-y border-border py-4 overflow-hidden"
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {doubled.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="font-mono text-xs uppercase tracking-widest text-text-tertiary"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
