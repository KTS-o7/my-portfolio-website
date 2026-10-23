import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import JsonLd from "@/app/components/site/JsonLd";
import HubPosts from "@/app/components/blog/HubPosts";
import {
  getHub,
  getPostsBySection,
  getSectionLabel,
  getSections,
  toSummary,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/profile";
import { breadcrumbSchema, personSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSections().map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const label = getSectionLabel(section);
  return buildPageMetadata({
    title: `${label} — Writing`,
    description:
      getHub(section)?.description ?? `Posts in the ${label} section of the blog.`,
    path: `/blog/${section}`,
  });
}

export default async function BlogSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const posts = getPostsBySection(section);
  if (posts.length === 0) notFound();

  const label = getSectionLabel(section);
  const hub = getHub(section);
  const siteUrl = getSiteUrl();
  const hubUrl = `${siteUrl}/blog/${section}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${hubUrl}#hub`,
        url: hubUrl,
        name: `${label} — Writing`,
        description: hub?.description,
        inLanguage: "en",
        author: personSchema(siteUrl),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: posts.length,
          itemListElement: posts.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${hubUrl}/${post.slug}`,
            name: post.title,
          })),
        },
      },
      breadcrumbSchema([
        { name: "Writing", url: `${siteUrl}/blog` },
        { name: label, url: hubUrl },
      ]),
    ],
  };

  return (
    <div className="pb-24 m:pb-12">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Writing", href: "/blog" },
          { label },
        ]}
      />
      <section className="mgrid pt-10 m:pt-[22px]">
        <div className="mspacer" />
        <div>
          <h1 className="h-hub">{label}</h1>
          {hub?.intro && (
            <p className="mt-4 max-w-[46ch] text-[23px] italic leading-[1.45] m:mt-3 m:text-[19px]">
              {hub.intro}
            </p>
          )}
        </div>
      </section>
      <HubPosts
        posts={posts.map(toSummary)}
        placeholder={`Search this hub — try ${hub?.searchHint ?? "a title or a year"}…`}
      />
    </div>
  );
}
