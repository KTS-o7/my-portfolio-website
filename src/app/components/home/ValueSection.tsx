"use client";
import React from "react";
import { motion } from "framer-motion";

const values = [
  {
    label: "AI-first",
    body: "Production LLM systems — agents, agentic memory, RAG, and evals built for real operational workloads.",
  },
  {
    label: "LLM tooling",
    body: "LangGraph + LiteLLM orchestration, retrieval pipelines, and evaluation at 1B+ tokens/month scale.",
  },
  {
    label: "End-to-end ownership",
    body: "From schema design to k8s deployment. I ship things that stay up.",
  },
];

export default function ValueSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Why work with me
          </p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            What I bring to a team
          </h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 border-t border-border pt-10">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                {v.label}
              </h3>
              <p className="mt-3 text-text-secondary leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
