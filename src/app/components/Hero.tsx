"use client";
import React, { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import heroData from "@/data/hero.json";

const metrics = [
  { value: "1B+", label: "tokens/month in production" },
  { value: "1,500+", label: "hours/year saved" },
  { value: "$800K+", label: "ARR growth contributed" },
];

const Hero: FC = () => {
  const bookingUrl = (heroData as any).bookingUrl as string;
  const resumeUrl = (heroData as any).resumeUrl as string;

  return (
    <section
      id="home"
      className="bg-background relative pt-32 md:pt-44 pb-16"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <header className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                {heroData.kicker}
              </p>

              <h1 className="mt-6 text-[clamp(2.5rem,6vw,4rem)] font-semibold tracking-tight leading-[1.04] text-text-primary max-w-[20ch]">
                {heroData.headline}
              </h1>
              <p className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-[68ch]">
                {heroData.subhead}
              </p>

              <p className="mt-6 text-text-tertiary font-mono text-sm leading-relaxed max-w-[68ch]">
                {heroData.current}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {/* Primary CTA */}
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Book a call
                </a>

                {/* Secondary CTAs */}
                <Link href="/projects" className="btn">
                  View selected work →
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

            {/* Oversized inline metrics */}
            <motion.dl
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-border pt-8"
            >
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
                    {metric.value}
                  </dd>
                  <dt className="mt-2 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </motion.dl>
          </header>

          <aside className="lg:col-span-4 order-first lg:order-last">
            <motion.figure
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              <div className="relative overflow-hidden border border-border aspect-[4/5] max-w-[280px]">
                <Image
                  src={heroData.image}
                  alt={`${heroData.name} portrait`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-sm text-text-secondary max-w-[280px]">
                <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Now
                </span>
                <div className="mt-1">{heroData.current}</div>
              </figcaption>
            </motion.figure>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Hero;
