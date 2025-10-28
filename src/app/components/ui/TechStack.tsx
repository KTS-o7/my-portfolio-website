"use client";
import React, { useEffect, useRef, useState } from "react";
import techData from "@/data/technologies.json";

export const TechStack = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
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

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    scrollPositionRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    scrollRef.current.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
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
    <div className="w-full overflow-hidden py-8 sm:py-12">
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        {techData.title}
      </h3>
      
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-hidden py-4 select-none cursor-grab active:cursor-grabbing"
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
            className="flex-shrink-0 group cursor-pointer"
          >
            <div className="glass-morphism px-6 py-4 rounded-xl border border-text-tertiary hover:border-primary/50 transition-all duration-300 min-w-[140px] sm:min-w-[160px] text-center hover:scale-105 box-shadow-glow">
              <div className="flex items-center justify-center h-12 sm:h-14 mb-3 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <p className="text-text-secondary text-sm sm:text-base font-medium group-hover:text-primary transition-colors">
                {tech.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-text-tertiary text-xs sm:text-sm mt-4">
        Hover to pause • Click and drag to scroll
      </p>
    </div>
  );
};

