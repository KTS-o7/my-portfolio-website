import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

// "Home / Writing / Systems" in the content column. On phones the leading "Home" is
// dropped to save the line; the header wordmark already links home.
export default function Breadcrumb({ items, className = "pt-7" }: { items: Crumb[]; className?: string }) {
  return (
    <div className={`mgrid ${className}`}>
      <div className="mspacer" />
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap gap-2 font-mono text-xs leading-relaxed text-tx2 m:gap-1.5 m:text-[11px]"
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const dropOnMobile = items.length > 2 && i <= 1;
          const mobileHidden = dropOnMobile && i === 0 ? "m:hidden" : "";
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && (
                <span aria-hidden="true" className={dropOnMobile ? "m:hidden" : ""}>
                  /
                </span>
              )}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className={`${last ? "text-ink" : ""} ${mobileHidden}`}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={mobileHidden}>
                  {item.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
}
