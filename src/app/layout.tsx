import { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import heroData from "@/data/hero.json";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import SiteHeader from "./components/site/SiteHeader";
import SiteFooter from "./components/site/SiteFooter";
import { getSiteUrl } from "@/lib/profile";
import { SITE_KEYWORDS } from "@/lib/metadata";
import { getSectionLabel, getSections } from "@/lib/blog";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const siteUrl = getSiteUrl();
const description = [heroData.shortDescription, heroData.shortDescriptionLine2]
  .filter(Boolean)
  .join(" ");

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${heroData.name} | Portfolio`,
    template: `%s | ${heroData.name}`,
  },
  description,
  keywords: SITE_KEYWORDS,
  openGraph: {
    title: `${heroData.name} | Portfolio`,
    description,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${heroData.name} | Portfolio`,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hubs = getSections().map((section) => ({
    href: `/blog/${section}`,
    label: getSectionLabel(section),
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();`,
          }}
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM profile"
        />
        {/* In <head> rather than metadata.alternates: pages that set a canonical replace
            the root alternates object, which would drop the feed link. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/blog/rss.xml"
          title={`${heroData.name} — Writing`}
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className={`${newsreader.variable} ${plexMono.variable}`}>
        <ThemeProvider>
          <a href="#content" className="skip-link">
            Skip to content
          </a>
          <div className="page">
            <SiteHeader hubs={hubs} />
            <main id="content">{children}</main>
            <SiteFooter hubs={hubs} />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
