import { getAllPosts, getPost, getSectionLabel } from "@/lib/blog";
import { getSiteUrl } from "@/lib/profile";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const FEED_SIZE = 30;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Feed readers resolve nothing relative, and "]]>" would end the CDATA block early.
const toFeedHtml = (html: string, siteUrl: string) =>
  html
    .replace(/(href|src)="\//g, `$1="${siteUrl}/`)
    .replace(/]]>/g, "]]]]><![CDATA[>");

export async function GET() {
  const siteUrl = getSiteUrl();
  const feedUrl = `${siteUrl}/blog/rss.xml`;
  const posts = getAllPosts().slice(0, FEED_SIZE);
  const updated = (p: (typeof posts)[number]) => new Date(p.lastmod ?? p.date ?? 0).getTime();
  const lastBuild = posts.length ? new Date(Math.max(...posts.map(updated))) : new Date(0);

  const items = await Promise.all(
    posts.map(async (meta) => {
      const url = `${siteUrl}/blog/${meta.section}/${meta.slug}`;
      const post = await getPost(meta.section, meta.slug);
      return [
        "<item>",
        `<title>${escapeXml(meta.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<dc:creator>${escapeXml(SITE.name)}</dc:creator>`,
        meta.description ? `<description>${escapeXml(meta.description)}</description>` : "",
        post ? `<content:encoded><![CDATA[${toFeedHtml(post.html, siteUrl)}]]></content:encoded>` : "",
        meta.date ? `<pubDate>${new Date(meta.date).toUTCString()}</pubDate>` : "",
        `<category>${escapeXml(getSectionLabel(meta.section))}</category>`,
        ...meta.tags.map((tag) => `<category>${escapeXml(tag)}</category>`),
        "</item>",
      ]
        .filter(Boolean)
        .join("\n");
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${escapeXml(`${SITE.name} — Writing`)}</title>
<link>${siteUrl}/blog</link>
<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
<description>Writing on machine learning, distributed systems, infrastructure, security, and engineering notes.</description>
<language>en</language>
<managingEditor>${escapeXml(`${SITE.email} (${SITE.name})`)}</managingEditor>
<lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
${items.join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
