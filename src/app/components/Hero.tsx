"use client";
import React, { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import heroData from "@/data/hero.json";

const Hero: FC = () => {
  return (
    <section
      id="home"
      className="bg-background relative overflow-hidden min-h-screen flex items-start pt-32 md:pt-44 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <header className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <span className="pill w-fit">{heroData.kicker}</span>

              <p className="mt-6 font-mono text-xs sm:text-sm uppercase tracking-widest text-text-tertiary">
                {heroData.name}
              </p>

              <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.02] text-text-primary max-w-[22ch]">
                {heroData.headline}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-[70ch]">
                {heroData.subhead}
              </p>

              <p className="mt-6 text-text-tertiary font-mono text-sm leading-relaxed max-w-[70ch]">
                {heroData.current}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroData.buttons.map((button) => {
                  const className =
                    button.type === "primary"
                      ? "btn btn-primary"
                      : "btn btn-secondary";

                  return button.external ? (
                    <Link
                      key={button.text}
                      href={button.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {button.text}
                    </Link>
                  ) : (
                    <a
                      key={button.text}
                      href={button.link}
                      className={className}
                    >
                      {button.text}
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {Array.isArray(heroData.proofPoints) &&
              heroData.proofPoints.length > 0 && (
                <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {heroData.proofPoints.map((point) => (
                    <div
                      key={point.label}
                      className="surface-card p-5 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <dt className="text-xs font-mono uppercase tracking-widest text-text-tertiary">
                        {point.label}
                      </dt>
                      <dd className="mt-2 text-text-primary">{point.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
          </header>

          <aside className="lg:col-span-5 order-first lg:order-last">
            <motion.figure
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="surface-card p-5"
            >
              <div className="relative overflow-hidden rounded-[14px] border border-[var(--border)] aspect-[4/5] bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)]">
                <Image
                  src={heroData.image}
                  alt={`${heroData.name} portrait`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-sm text-text-secondary">
                <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Now
                </span>
                <div className="mt-1">{heroData.current}</div>
              </figcaption>
            </motion.figure>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="surface-card p-5 mt-5"
            >
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                How I Work
              </h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                I optimize for clarity and operational confidence — the kind you
                feel at 2am.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  "Define contracts",
                  "Design workflows",
                  "Make it observable",
                  "Ship + iterate",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[14px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--color-surface)_86%,transparent)] p-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
};
export default Hero;
