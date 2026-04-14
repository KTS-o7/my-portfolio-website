import type { Metadata } from "next";

const SITE_NAME = "Krishnatejaswi Shenthar";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://krishnatejaswi.com";

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
