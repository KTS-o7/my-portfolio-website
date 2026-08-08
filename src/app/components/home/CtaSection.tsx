"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import heroData from "@/data/hero.json";

export default function CtaSection() {
  const bookingUrl = (heroData as any).bookingUrl as string;
  const resumeUrl = (heroData as any).resumeUrl as string;

  return (
    <section className="bg-background py-20 sm:py-28 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Contact
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary max-w-[24ch]">
            Let&apos;s build something reliable.
          </h2>
          <p className="mt-4 text-text-secondary max-w-[60ch] leading-relaxed">
            Available for full-time roles and select freelance projects. Based in Bangalore — open to remote.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Book a call
            </a>
            <Link href="/contact" className="btn">
              Send a message →
            </Link>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Resume ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
