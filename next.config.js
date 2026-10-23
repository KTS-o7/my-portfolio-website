// Old blog URLs (underscored slugs, merged duplicates) -> current slugs.
const blogRedirects = require("./src/data/blog-redirects.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
