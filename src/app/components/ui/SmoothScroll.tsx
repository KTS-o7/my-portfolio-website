"use client";

import { useEffect } from "react";

export const SmoothScroll = () => {
    useEffect(() => {
        // Enable native smooth scrolling for the entire document
        document.documentElement.style.scrollBehavior = "smooth";

        // Smooth scroll functionality for hash links
        const handleSmoothScroll = (e: Event) => {
            // Only process hash links that point to sections on this page
            const target = e.currentTarget as HTMLAnchorElement;
            const href = target.getAttribute("href");

            if (!href?.startsWith("#") && !href?.startsWith("/#")) return;

            e.preventDefault();

            // Get the target ID, handling both "#section" and "/#section" formats
            const targetId = href.includes("/#")
                ? href.substring(2)
                : href.substring(1);

            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset to account for the navbar
                    behavior: "smooth",
                });

                // Update the URL without scrolling
                window.history.pushState(null, "", href);
            }
        };

        // Apply to all hash links across the site
        const hashLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
        hashLinks.forEach((link) => {
            link.addEventListener("click", handleSmoothScroll);
        });

        // Re-attach listeners when DOM changes (e.g. dynamic content loading)
        const observer = new MutationObserver((mutations) => {
            const newHashLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
            newHashLinks.forEach((link) => {
                link.removeEventListener("click", handleSmoothScroll); // avoid duplicates
                link.addEventListener("click", handleSmoothScroll);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            // Clean up event listeners and CSS
            document.documentElement.style.scrollBehavior = "";
            hashLinks.forEach((link) => {
                link.removeEventListener("click", handleSmoothScroll);
            });
            observer.disconnect();
        };
    }, []);

    return null; // This component handles side effects only
};
