"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { useTheme } from "@/app/context/ThemeContext";
import { NAV, SITE, type HubLink } from "@/lib/site";

const isActive = (pathname: string, match: string[]) =>
  match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export default function SiteHeader({ hubs }: { hubs: HubLink[] }) {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="mgrid border-b border-rule py-5 m:pb-3 m:pt-2">
        <div className="mspacer" />
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 m:flex-nowrap m:items-center">
          <Link
            href="/"
            className="whitespace-nowrap text-[23px] font-semibold leading-none tracking-[-0.01em] text-ink m:text-[19px]"
          >
            {SITE.name}
          </Link>
          <nav
            aria-label="Main"
            className="flex items-center gap-[22px] font-mono text-xs uppercase leading-none tracking-[0.06em] m:hidden"
          >
            {NAV.map((item) => {
              const active = isActive(pathname, item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "text-ink" : "text-tx2"}
                >
                  {item.title}
                </Link>
              );
            })}
            <ThemeToggle />
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="hidden min-h-11 items-center font-mono text-xs uppercase tracking-[0.06em] text-ink m:inline-flex"
          >
            Menu
          </button>
        </div>
      </header>
      {menuOpen && (
        <MenuSheet hubs={hubs} pathname={pathname} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
}

function MenuSheet({
  hubs,
  pathname,
  onClose,
}: {
  hubs: HubLink[];
  pathname: string;
  onClose: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div id="site-menu" className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex items-center justify-between border-b border-rule pb-3 pt-2">
        <Link href="/" onClick={onClose} className="text-[19px] font-semibold leading-none text-ink">
          {SITE.name}
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.06em] text-acc"
        >
          Close ×
        </button>
      </div>

      <nav aria-label="Main" className="mt-5 flex flex-col">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            aria-current={isActive(pathname, item.match) ? "page" : undefined}
            className="border-b border-rule py-[14px] text-[36px] font-medium leading-none text-ink"
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="mt-[22px] font-mono text-[11px] text-acc">hubs</div>
      <nav aria-label="Writing hubs" className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[18px] text-ink">
        {hubs.map((hub) => (
          <Link key={hub.href} href={hub.href} onClick={onClose}>
            {hub.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2.5 pt-8">
        <div className="grid grid-cols-2 gap-2">
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-ink min-h-12">
            Book a call ↗
          </a>
          <a href={`mailto:${SITE.email}`} className="btn-ink min-h-12">
            Email me →
          </a>
        </div>
        <div className="flex items-center justify-between border-t border-rule pt-3 font-mono text-xs text-tx2">
          <span>Theme</span>
          <span className="seg" role="group" aria-label="Theme">
            <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
              Light
            </button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
              Dark
            </button>
          </span>
        </div>
        <div className="flex gap-[18px] font-mono text-xs text-ink">
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
            GitHub ↗
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
            LinkedIn ↗
          </a>
          <a href={SITE.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
            Resume ↗
          </a>
        </div>
      </div>
    </div>
  );
}
