"use client";

import { useState } from "react";
import type { TocItem } from "@/lib/blog";

const MOBILE_VISIBLE = 4;
const sectionNumber = (i: number) => String(i + 1).padStart(2, "0");

// The post's H2s. Desktop: a two-column list. Phones: an open <details> showing the
// first four, with "… N more" to expand the rest.
export default function Contents({ items }: { items: TocItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = items.length - MOBILE_VISIBLE;
  const collapsed = !expanded && hidden > 0;

  return (
    <details open className="toc" data-collapsed={collapsed}>
      <summary>
        <span>contents</span>
        <span className="toc-sign text-acc" aria-hidden="true" />
      </summary>
      <ol>
        {items.map((item, i) => (
          <li key={item.id} className={i >= MOBILE_VISIBLE ? "toc-extra" : undefined}>
            <a href={`#${item.id}`}>
              <span className="toc-n">§ {sectionNumber(i)}</span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
        {collapsed && (
          <li className="toc-more">
            <button type="button" onClick={() => setExpanded(true)}>
              <span className="toc-n">…</span>
              <span>{hidden} more</span>
            </button>
          </li>
        )}
      </ol>
    </details>
  );
}
