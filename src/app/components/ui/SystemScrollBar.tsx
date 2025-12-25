"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const SystemScrollBar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            setPercentage(Math.round(v * 100));
        });
    }, [scrollYProgress]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-[24px] bg-background border-t border-primary/20 flex items-center px-4 font-mono text-[10px] uppercase tracking-widest text-primary hidden md:flex">
            <div className="w-[150px] flex-shrink-0">
                SYSTEM_SCAN: {percentage.toString().padStart(3, '0')}%
            </div>
            <div className="flex-grow relative h-[2px] bg-primary/20 mx-4">
                <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-primary h-full"
                    style={{ scaleX, transformOrigin: "0%" }}
                />
            </div>
            <div className="w-[100px] flex-shrink-0 text-right">
                [ACTIVE]
            </div>
        </div>
    );
};
