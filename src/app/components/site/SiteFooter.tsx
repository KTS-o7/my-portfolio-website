import Link from "next/link";
import { SITE, type HubLink } from "@/lib/site";

export default function SiteFooter({ hubs }: { hubs: HubLink[] }) {
  const elsewhere = [
    { label: "GitHub ↗", href: SITE.github },
    { label: "Twitter ↗", href: SITE.twitter },
    { label: "LinkedIn ↗", href: SITE.linkedin },
    { label: "Resume ↗", href: SITE.resumeUrl },
  ].filter((link) => link.href);

  return (
    <footer className="mgrid mt-auto border-t border-rule2 pb-[72px] pt-7">
      <div className="mspacer" />
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))] gap-7 m:grid-cols-2">
        <div className="m:col-span-2">
          <div className="text-[21px] font-semibold leading-tight text-ink">{SITE.name}</div>
          <div className="mt-1.5 font-mono text-[11px] text-tx2">© {new Date().getFullYear()}</div>
        </div>
        <nav aria-label="Writing hubs" className="flex flex-col gap-1.5 text-[17px]">
          <span className="font-mono text-[11px] text-acc">hubs</span>
          {hubs.map((hub) => (
            <Link key={hub.href} href={hub.href}>
              {hub.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Elsewhere" className="flex flex-col gap-1.5 text-[17px]">
          <span className="font-mono text-[11px] text-acc">elsewhere</span>
          {elsewhere.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
