// Old blog URLs (underscored slugs, merged duplicates) -> current slugs.
const blogRedirects = require("./src/data/blog-redirects.json");

// Files Google crawls but should not list in search. Each gets an X-Robots-Tag header,
// so Search Console reports them as "Excluded by noindex" instead of
// "Crawled - currently not indexed".
const noindex = [{ key: "X-Robots-Tag", value: "noindex" }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // Generated social-card images (Next.js appends a ?hash; the header covers both).
      { source: "/opengraph-image", headers: noindex },
      { source: "/blog/:section/:slug/opengraph-image", headers: noindex },
      // Feeds and machine-readable files.
      { source: "/blog/rss.xml", headers: noindex },
      { source: "/llms.txt", headers: noindex },
      { source: "/sitemap.xml", headers: noindex },
      // Whiteboards are embedded in posts by iframe. indexifembedded lets Google index
      // them as part of the post while keeping the standalone file out of results.
      {
        source: "/whiteboards/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, indexifembedded" }],
      },
    ];
  },
  async redirects() {
    return [
      ...blogRedirects.map((r) => ({ ...r, permanent: true })),
      {
        source: "/publications",
        destination: "/projects?filter=publication",
        permanent: true,
      },
      {
        source: "/llm.txt",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/.well-known/llms.txt",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/works",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/works/:path*",
        destination: "/work/:path*",
        permanent: true,
      },
      {
        source: "/case-studies/complianceos",
        destination: "/work/complianceos",
        permanent: true,
      },
      {
        source: "/work/future-standard",
        destination: "/experience/future-standard",
        permanent: true,
      },
      {
        source: "/work/onfinance-ai",
        destination: "/experience/onfinance-ai",
        permanent: true,
      },
      {
        source: "/work/ringcentral",
        destination: "/experience/ringcentral",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/experience",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "logo.svgcdn.com",
        pathname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
