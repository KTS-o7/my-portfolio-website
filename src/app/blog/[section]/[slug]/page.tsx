import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CodeCopyEnhancer from "@/app/components/CodeCopyEnhancer";
import {
  formatPostDate,
  getAllPosts,
  getPost,
  getSectionLabel,
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/profile";
import "katex/dist/katex.min.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    section: post.section,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const post = await getPost(section, slug);
  if (!post) return {};

  const title = `${post.title} | Krishnatejaswi Shenthar`;
  const description =
    post.description || `${post.title} — a post on the blog.`;
  const path = `/blog/${post.section}/${post.slug}`;
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    keywords: post.tags.length ? post.tags : undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      type: "article",
      publishedTime: post.date ?? undefined,
      tags: post.tags.length ? post.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const post = await getPost(section, slug);
  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/blog/${post.section}/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#post`,
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.date ?? undefined,
    url: postUrl,
    mainEntityOfPage: postUrl,
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    inLanguage: "en",
    author: { "@id": `${siteUrl}#person` },
    isPartOf: { "@id": `${siteUrl}#website` },
  };

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Script
        id={`blog-jsonld-${post.section}-${post.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="pt-24">
        <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 pb-24">
          <Link
            href={`/blog/${post.section}`}
            className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors link-underline"
          >
            ← {getSectionLabel(post.section)}
          </Link>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-widest text-text-tertiary">
            <time dateTime={post.date ?? undefined}>
              {formatPostDate(post.date)}
            </time>
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            {post.title}
          </h1>

          <div
            className="post-content mt-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <CodeCopyEnhancer />
        </article>
      </div>
      <Footer />
    </main>
  );
}
