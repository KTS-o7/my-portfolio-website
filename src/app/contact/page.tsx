import type { Metadata } from "next";
import contactData from "@/data/contact.json";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: contactData.availability,
  path: "/contact",
});

const cardClass =
  "flex flex-col gap-3.5 bg-ink p-[22px] text-paper transition-colors duration-150 hover:bg-acc hover:text-paper";

export default function ContactPage() {
  return (
    <div className="pb-24 m:pb-12">
      <section className="mgrid pt-14 m:pt-[26px]">
        <div className="mspacer" />
        <div>
          <h1 className="h-page">Let&apos;s work together</h1>
          <p className="lead mt-4 max-w-[52ch]">{contactData.availability}</p>
        </div>
      </section>

      <section className="mgrid pt-10 m:pt-7">
        <div className="mspacer" />
        <div className="grid max-w-[820px] grid-cols-2 gap-4 m:grid-cols-1 m:gap-2">
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
            <span className="text-[34px] font-medium leading-none m:text-[28px]">Book a call ↗</span>
          </a>
          <a href={`mailto:${SITE.email}`} className={cardClass}>
            <span className="text-[34px] font-medium leading-none m:text-[28px]">Email me →</span>
            <span className="break-all font-mono text-xs">{SITE.email}</span>
          </a>
        </div>
      </section>

      <section className="mgrid pt-4">
        <div className="mspacer" />
        <div className="flex flex-wrap gap-x-6 font-mono text-[13px] text-ink">
          <a href={`tel:${SITE.phone.link}`} className="inline-flex min-h-11 items-center">
            {SITE.phone.display}
          </a>
          <a href={SITE.whatsapp.link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
            WhatsApp ↗
          </a>
        </div>
      </section>
    </div>
  );
}
