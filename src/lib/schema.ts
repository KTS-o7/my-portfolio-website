import { SITE } from "@/lib/site";

// The site's author as a self-contained schema.org Person, so each page's JSON-LD
// names the author without depending on the homepage graph.
export const personSchema = (siteUrl: string) => ({
  "@type": "Person",
  "@id": `${siteUrl}#person`,
  name: SITE.name,
  url: `${siteUrl}/about`,
  sameAs: [SITE.github, SITE.linkedin].filter(Boolean),
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});
