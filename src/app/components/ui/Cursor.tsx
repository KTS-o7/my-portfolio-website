"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Cursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener("mousemove", updateMousePosition);

        // Add event listeners to all clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
        clickables.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        });

        // Mutation observer to handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            const newClickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
            newClickables.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter); // cleanup to prevent duplicates
                el.removeEventListener("mouseleave", handleMouseLeave);

                el.addEventListener("mouseenter", handleMouseEnter);
                el.addEventListener("mouseleave", handleMouseLeave);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            clickables.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
            });
            observer.disconnect();
        };
    }, [isVisible]);

    // Don't render on mobile/tablet (touch devices usually don't have cursors)
    // This is a simple check; a more robust one uses window.matchMedia('(hover: hover)')
    // We'll hide it via CSS media query primarily, but returning null here helps for SSR mismatch avoidance if we had a way to detect device.
    // For now, we'll use a CSS class to hide it on small screens.

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none mix-blend-difference"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    mass: 0.2, // increased mass for slight delay
                    stiffness: 800,
                    damping: 35
                }}
            >
                {/* Tactical Crosshair Design */}
                <div className={`relative w-full h-full transition-all duration-300 ${isHovering ? "rotate-45" : "rotate-0"}`}>
                    {/* Center Dot */}
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary -translate-x-1/2 -translate-y-1/2 rounded-full" />

                    {/* Brackets */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary transition-all duration-300 ${isHovering ? "top-[-4px] left-[-4px]" : ""}`} />
                    <div className={`absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary transition-all duration-300 ${isHovering ? "top-[-4px] right-[-4px]" : ""}`} />
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary transition-all duration-300 ${isHovering ? "bottom-[-4px] left-[-4px]" : ""}`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary transition-all duration-300 ${isHovering ? "bottom-[-4px] right-[-4px]" : ""}`} />
                </div>
            </motion.div>
        </div>
    );
};
