import { getAllPosts } from "@/lib/blog";
import { getProfileData, getSiteUrl } from "@/lib/profile";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const siteUrl = getSiteUrl();
  const profile = getProfileData(siteUrl);
  const posts = getAllPosts().slice(0, 30);

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.section}/${post.slug}`;
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        post.description
          ? `<description>${escapeXml(post.description)}</description>`
          : "",
        post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : "",
        ...post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`),
        "</item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(`${profile.name} — Blog`)}</title>
<link>${siteUrl}/blog</link>
<description>Writing on machine learning, distributed systems, infrastructure, and engineering notes.</description>
<language>en</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
