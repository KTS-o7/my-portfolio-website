import type { Metadata } from "next";
import heroData from "@/data/hero.json";
import contactData from "@/data/contact.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Contact from "@/app/components/Contact";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    (contactData as any).availability ||
    contactData.description ||
    heroData.shortDescription,
  path: "/contact",
});

export default function ContactPage() {
  const bookingUrl = (contactData as any).bookingUrl as string;

  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <div className="pt-24 max-w-[1100px] mx-auto px-4 sm:px-6 w-full">
        <header className="py-12 border-b border-border">
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">Available</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            Let&apos;s work together
          </h1>
          <p className="mt-4 text-text-secondary max-w-[60ch] leading-relaxed">
            {(contactData as any).availability ||
              "Available for full-time roles and select freelance projects."}
          </p>
          {bookingUrl && (
            <div className="mt-6">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Book a call
              </a>
            </div>
          )}
        </header>
      </div>
      <Contact showTopBorder={false} />
      <Footer />
    </main>
  );
}
