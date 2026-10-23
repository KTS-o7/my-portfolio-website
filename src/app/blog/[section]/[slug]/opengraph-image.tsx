import { formatHumanDate, getAllPosts, getSectionLabel } from "@/lib/blog";
import { OG_SIZE, renderOgCard } from "@/lib/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Post title on graph paper";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ section: post.section, slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const post = getAllPosts().find((p) => p.section === section && p.slug === slug);
  return renderOgCard({
    margin: [getSectionLabel(section), "hub"],
    kicker: "portfolio.shenthar.me / writing",
    title: post?.title ?? slug,
    footerLeft: SITE.name,
    footerRight: formatHumanDate(post?.date ?? null),
  });
}
