import Link from "next/link";
import type { Metric } from "@/lib/portfolio";
import { SITE } from "@/lib/site";

// Heading row: "§ n" in the margin, the H2, and an optional link on the right.
export function SectionHead({
  n,
  title,
  link,
  id,
}: {
  n?: string;
  title: string;
  link?: { href: string; label: string };
  id?: string;
}) {
  return (
    <div className="mgrid items-baseline">
      <div className="mnote mnote-sec">{n ? `§ ${n}` : ""}</div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="h-section">
          {title}
        </h2>
        {link && (
          <Link href={link.href} className="whitespace-nowrap font-mono text-xs text-tx2 m:text-[11px]">
            {link.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// Big numbers over mono labels. The label is the term (dt) and comes first in the DOM;
// column-reverse puts the value on top.
export function Metrics({ items, className = "" }: { items: Metric[]; className?: string }) {
  return (
    <dl className={`metrics ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col-reverse justify-end">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// The two equal-weight primary actions.
export function CtaPair() {
  return (
    <>
      <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-ink">
        Book a call ↗
      </a>
      <a href={`mailto:${SITE.email}`} className="btn-ink">
        Email me →
      </a>
    </>
  );
}

export function ResumeLink() {
  return (
    <a href={SITE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-text">
      Resume ↗
    </a>
  );
}
