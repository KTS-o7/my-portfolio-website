import type { Metadata } from "next";
import heroData from "@/data/hero.json";
import contactData from "@/data/contact.json";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Contact from "@/app/components/Contact";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

const title = `Contact | ${heroData.name}`;
const description = contactData.description || heroData.shortDescription;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title,
    description,
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main
      id="content"
      className="flex min-h-screen flex-col bg-background transition-colors duration-300"
    >
      <Navbar />
      <h1 className="sr-only">Contact {heroData.name}</h1>
      <div className="pt-24">
        <Contact showTopBorder={false} />
      </div>

      <Footer />
      <ThemeToggle />
    </main>
  );
}
