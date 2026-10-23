"use client";

import { useState } from "react";

// Copies the post's canonical URL; the label says "link copied" for 1.5 s.
export default function CopyLinkButton({ url }: { url: string }) {
  const [label, setLabel] = useState("copy link");

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setLabel("link copied");
    } catch {
      setLabel("copy failed");
    }
    setTimeout(() => setLabel("copy link"), 1500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 shrink-0 whitespace-nowrap font-mono text-xs text-acc underline underline-offset-[3px] hover:text-ink m:text-[11px]"
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
