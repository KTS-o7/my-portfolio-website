import { Metadata } from "next";
import { Inter } from "next/font/google";
import heroData from "@/data/hero.json";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { getSiteUrl } from "@/lib/profile";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = getSiteUrl();
const description = [heroData.shortDescription, heroData.shortDescriptionLine2]
  .filter(Boolean)
  .join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${heroData.name} | Portfolio`,
  description,
  openGraph: {
    title: `${heroData.name} | Portfolio`,
    description,
    url: "/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href="/llm.txt"
          title="LLM profile"
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
