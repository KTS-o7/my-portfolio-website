"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import heroData from "@/data/hero.json";

export default function CtaSection() {
  const bookingUrl = (heroData as any).bookingUrl as string;
  const resumeUrl = (heroData as any).resumeUrl as string;

  return (
    <section className="bg-background py-20 sm:py-28 border-t border-text-tertiary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary">
            Let&apos;s build something reliable.
          </h2>
          <p className="mt-4 text-text-secondary max-w-[60ch] mx-auto leading-relaxed">
            Available for full-time roles and select freelance projects. Based in Bangalore — open to remote.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Book a call
            </a>
            <Link href="/contact" className="btn btn-secondary">
              Send a message
            </Link>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Resume ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
