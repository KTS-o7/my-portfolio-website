"use client";
import React from "react";
import { motion } from "framer-motion";

const values = [
  {
    label: "Backend-first",
    body: "APIs, distributed systems, and data pipelines built for production — observable, reliable, fast.",
  },
  {
    label: "LLM tooling",
    body: "RAG pipelines, agentic workflows, evals, and LiteLLM orchestration over real regulatory-scale corpora.",
  },
  {
    label: "End-to-end ownership",
    body: "From schema design to k8s deployment. I ship things that stay up.",
  },
];

export default function ValueSection() {
  return (
    <section className="bg-background py-20 sm:py-24 border-t border-text-tertiary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="pill">Why work with me</span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            What I bring to a team
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface-card p-6"
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">{v.label}</h3>
              <p className="mt-3 text-text-secondary leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
