import type { Metadata } from "next";

const SITE_NAME = "Krishnatejaswi Shenthar";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.shenthar.me";

export const SITE_KEYWORDS = [
  "Krishnatejaswi Shenthar",
  "AI Engineer",
  "LLM Engineer",
  "Production LLM Systems",
  "RAG",
  "Retrieval Augmented Generation",
  "LangGraph",
  "LiteLLM",
  "AI Agents",
  "Agentic Workflows",
  "Agentic Memory",
  "LLM Evals",
  "Vector Databases",
  "VectorDB",
  "Python",
  "Go",
  "TypeScript",
  "FastAPI",
  "Distributed Systems",
  "Bengaluru",
  "Bangalore",
  "Ex-RingCentral",
  "Future Standard",
];

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "profile" | "article";
}): Metadata {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  return {
    title,
    description,
    keywords: SITE_KEYWORDS,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
