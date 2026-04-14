import { Metadata } from "next";
import heroData from "@/data/hero.json";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { getSiteUrl } from "@/lib/profile";

const siteUrl = getSiteUrl();
const description = [heroData.shortDescription, heroData.shortDescriptionLine2]
  .filter(Boolean)
  .join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${heroData.name} | Portfolio`,
    template: `%s | Krishnatejaswi Shenthar`,
  },
  description,
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var p=localStorage.getItem('palette')||'forestPink';document.documentElement.classList.add(t==='light'?'light':'dark');document.documentElement.setAttribute('data-palette',p);}catch(e){}})();`,
          }}
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM profile"
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
