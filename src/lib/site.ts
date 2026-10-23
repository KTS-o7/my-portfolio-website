import contactData from "@/data/contact.json";
import heroData from "@/data/hero.json";

const social = (platform: string) =>
  contactData.socialMedia.find((item) => item.platform === platform)?.url ?? "";

// Contact and profile links used across the shell and pages.
export const SITE = {
  name: heroData.name,
  email: contactData.email,
  bookingUrl: contactData.bookingUrl,
  resumeUrl: contactData.resumeUrl,
  phone: contactData.phone,
  whatsapp: contactData.whatsapp,
  github: social("github"),
  twitter: social("twitter"),
  linkedin: social("linkedin"),
};

export const NAV = [
  { title: "Work", href: "/experience", match: ["/experience", "/projects", "/work"] },
  { title: "Writing", href: "/blog", match: ["/blog"] },
  { title: "About", href: "/about", match: ["/about"] },
  { title: "Contact", href: "/contact", match: ["/contact"] },
];

export type HubLink = { href: string; label: string };
