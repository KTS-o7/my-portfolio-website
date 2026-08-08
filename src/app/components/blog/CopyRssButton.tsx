"use client";

import { useState } from "react";

/**
 * Copies the blog RSS feed URL to the clipboard.
 * Rendered in the /blog header next to the feed link.
 */
export default function CopyRssButton() {
  const [label, setLabel] = useState("Copy RSS link");

  const onClick = async () => {
    const url = `${window.location.origin}/blog/rss.xml`;
    try {
      await navigator.clipboard.writeText(url);
      setLabel("Copied");
    } catch {
      setLabel("Failed");
    }
    setTimeout(() => setLabel("Copy RSS link"), 1500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-primary transition-colors link-underline"
    >
      {label}
    </button>
  );
}
