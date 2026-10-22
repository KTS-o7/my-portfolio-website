"use client";

import { useEffect } from "react";

/**
 * Keeps embedded whiteboard iframes (```whiteboard blocks, see lib/blog.ts) in step
 * with the site theme, and sizes each frame from the height the board reports.
 * The frames are sandboxed without same-origin, so postMessage is the only channel.
 */
export default function WhiteboardEnhancer() {
  useEffect(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLIFrameElement>(
        ".post-content iframe.whiteboard-frame",
      ),
    );
    if (!frames.length) return;

    const theme = () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";
    const sendTheme = (frame: HTMLIFrameElement) =>
      frame.contentWindow?.postMessage({ type: "wb-theme", theme: theme() }, "*");

    const onMessage = (event: MessageEvent) => {
      const frame = frames.find((f) => f.contentWindow === event.source);
      if (!frame || event.data?.type !== "wb-height") return;
      const height = Number(event.data.height);
      if (Number.isFinite(height) && height > 0) {
        frame.style.height = `${Math.min(height, 4000)}px`;
      }
    };
    const onLoad = (event: Event) => sendTheme(event.target as HTMLIFrameElement);

    window.addEventListener("message", onMessage);
    frames.forEach((frame) => {
      frame.addEventListener("load", onLoad);
      sendTheme(frame);
    });
    const observer = new MutationObserver(() => frames.forEach(sendTheme));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("message", onMessage);
      frames.forEach((frame) => frame.removeEventListener("load", onLoad));
      observer.disconnect();
    };
  }, []);

  return null;
}
