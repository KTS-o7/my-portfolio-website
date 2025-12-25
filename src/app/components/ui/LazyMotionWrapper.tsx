"use client";

import { LazyMotion, domAnimation } from "framer-motion";

export const LazyMotionWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <LazyMotion features={domAnimation}>
            {children}
        </LazyMotion>
    );
};
