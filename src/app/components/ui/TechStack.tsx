"use client";
import React, { useEffect, useRef, useState } from "react";
import techData from "@/data/technologies.json";
import NextImage from "next/image";

export const TechStack = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 0.3;

    const animate = () => {
      if (!isPaused && !isDraggingRef.current) {
        scrollPositionRef.current += scrollSpeed;

        if (scrollPositionRef.current >= scrollContainer.scrollWidth / 2) {
          scrollPositionRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollPositionRef.current;
      } else if (!isDraggingRef.current) {
        scrollPositionRef.current = scrollContainer.scrollLeft;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    scrollPositionRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    isDraggingRef.current = false;
    scrollRef.current.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current && scrollRef.current) {
      isDraggingRef.current = false;
      scrollRef.current.style.cursor = "grab";
    }
    setIsPaused(false);
  };

  const duplicatedTechnologies = [
    ...techData.technologies,
    ...techData.technologies,
  ];

  return (
    <div className="w-full overflow-hidden py-12 border-y border-text-tertiary/10 bg-black/20">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px w-12 bg-primary/30"></div>
        <h3 className="text-xl font-mono font-bold text-white uppercase tracking-widest">
          {techData.title}_
        </h3>
        <div className="h-px w-12 bg-primary/30"></div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-px overflow-x-hidden py-4 select-none cursor-grab active:cursor-grabbing bg-text-tertiary/10"
        style={{ scrollBehavior: "auto" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {duplicatedTechnologies.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex-shrink-0 group cursor-pointer bg-surface hover:bg-primary/10 transition-colors w-[160px] sm:w-[180px] h-[120px] flex flex-col items-center justify-center border-r border-text-tertiary/20 relative"
          >
            <div className="absolute top-2 right-2 text-[10px] font-mono text-text-tertiary opacity-50 group-hover:text-primary group-hover:opacity-100">
              {(index + 1).toString().padStart(2, '0')}
            </div>

            <div className="h-10 w-10 sm:h-12 sm:w-12 mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:scale-110 relative">
              <NextImage
                src={tech.logo}
                alt={tech.name}
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <p className="text-text-secondary text-xs font-mono uppercase tracking-wider group-hover:text-primary transition-colors">
              {tech.name}
            </p>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center px-4 max-w-7xl mx-auto mt-4 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
        <span>&lt; SCROLL_TO_NAVIGATE &gt;</span>
        <span>TOTAL_NODES: {techData.technologies.length}</span>
      </div>
    </div>
  );
};
