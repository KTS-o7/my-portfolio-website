import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import JsonLd from "@/app/components/site/JsonLd";
import CodeCopyEnhancer from "@/app/components/CodeCopyEnhancer";
import WhiteboardEnhancer from "@/app/components/WhiteboardEnhancer";
import Contents from "@/app/components/blog/Contents";
import CopyLinkButton from "@/app/components/blog/CopyLinkButton";
import {
  formatHumanDate,
  formatPostDate,
  getAllPosts,
  getPost,
  getPostsBySection,
  getRelatedPosts,
  getSectionLabel,
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/profile";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
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

  const title = post.title;
  const description =
    post.description || `${post.title} — a post on the blog.`;
  const path = `/blog/${post.section}/${post.slug}`;
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    keywords: post.tags.length ? post.tags : undefined,
    alternates: { canonical: path },
    authors: [{ name: SITE.name, url: `${siteUrl}/about` }],
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      type: "article",
      publishedTime: post.date ?? undefined,
      modifiedTime: post.lastmod ?? post.date ?? undefined,
      section: getSectionLabel(post.section),
      authors: [`${siteUrl}/about`],
      tags: post.tags.length ? post.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// "Raft: Consensus for the Rest of Us" → "Raft" for the breadcrumb.
const shortTitle = (title: string) => title.split(":")[0].trim();

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const post = await getPost(section, slug);
  if (!post) notFound();

  const label = getSectionLabel(post.section);
  const siteUrl = getSiteUrl();
  const hubUrl = `${siteUrl}/blog/${post.section}`;
  const postUrl = `${hubUrl}/${post.slug}`;
  const related = getRelatedPosts(post);
  const hubTotal = getPostsBySection(post.section).length;
  const author = personSchema(siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#post`,
        headline: post.title,
        description: post.description || undefined,
        datePublished: post.date ?? undefined,
        dateModified: post.lastmod ?? post.date ?? undefined,
        image: `${postUrl}/opengraph-image`,
        url: postUrl,
        mainEntityOfPage: postUrl,
        author,
        publisher: author,
        articleSection: label,
        keywords: post.tags.length ? post.tags.join(", ") : undefined,
        wordCount: post.words,
        inLanguage: "en",
        isPartOf: { "@type": "Blog", "@id": `${siteUrl}/blog#blog`, url: `${siteUrl}/blog` },
      },
      breadcrumbSchema([
        { name: "Writing", url: `${siteUrl}/blog` },
        { name: label, url: hubUrl },
        { name: post.title, url: postUrl },
      ]),
    ],
  };

  return (
    <article className="pb-24 m:pb-12">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Writing", href: "/blog" },
          { label, href: `/blog/${post.section}` },
          { label: shortTitle(post.title) },
        ]}
        className="pt-7 m:pt-3.5"
      />

      <header className="mgrid pt-11 m:pt-5">
        <div className="mspacer" />
        <div className="max-w-[760px]">
          <h1 className="h-post">{post.title}</h1>
          {post.description && <p className="standfirst mt-5 m:mt-3.5">{post.description}</p>}
        </div>
      </header>

      <div className="mgrid mt-7 m:mt-4">
        <div className="mspacer" />
        <div className="flex max-w-[760px] flex-wrap items-center justify-between gap-x-[22px] gap-y-1.5 border-b border-t border-b-rule border-t-rule2 py-1.5 font-mono text-xs text-tx2 m:flex-nowrap m:gap-x-3 m:py-0 m:text-[11px]">
          <span>
            <Link href="/about" className="text-ink underline underline-offset-[3px]">
              {SITE.name}
            </Link>
            {" · "}
            <time dateTime={post.date ?? undefined} className="whitespace-nowrap">
              {formatHumanDate(post.date)}
            </time>
            {post.lastmod && (
              <>
                {" · "}
                <span className="whitespace-nowrap">
                  Updated <time dateTime={post.lastmod}>{formatHumanDate(post.lastmod)}</time>
                </span>
              </>
            )}
            {" · "}
            <span className="whitespace-nowrap">
              {post.readMin} min<span className="m:hidden"> read</span>
            </span>
          </span>
          <CopyLinkButton url={postUrl} />
        </div>
      </div>

      {post.toc.length > 1 && (
        <nav aria-label="Contents" className="mgrid mt-7 m:mt-3.5">
          <div className="mspacer" />
          <div className="max-w-[760px]">
            <Contents items={post.toc} />
          </div>
        </nav>
      )}

      <div className="mgrid mt-9 m:mt-[22px]">
        <div className="mspacer" />
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
      <CodeCopyEnhancer />
      <WhiteboardEnhancer />

      {related.length > 0 && (
        <aside aria-label="See also" className="mgrid mt-20 m:mt-14">
          <div className="mnote mnote-sec pt-4">see also</div>
          <div className="max-w-[760px] border-t-[1.5px] border-rule2 pt-3 m:mt-1.5">
            {related.map((item) => (
              <Link
                key={`${item.section}/${item.slug}`}
                href={`/blog/${item.section}/${item.slug}`}
                className="group flex items-baseline justify-between gap-6 border-b border-rule py-2.5"
              >
                <span className="text-[20px] font-medium leading-snug text-ink group-hover:text-acc m:text-[18px]">
                  {item.title}
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] text-tx2 m:hidden">
                  {formatPostDate(item.date)}
                </span>
              </Link>
            ))}
            <Link
              href={`/blog/${post.section}`}
              className="mt-3.5 inline-flex min-h-11 items-center font-mono text-xs text-acc"
            >
              All {hubTotal} in {label} →
            </Link>
          </div>
        </aside>
      )}
    </article>
  );
}
