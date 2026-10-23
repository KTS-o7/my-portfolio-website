"use client";

import { useEffect } from "react";

/**
 * Keeps embedded whiteboard iframes (```whiteboard blocks, see lib/blog.ts) in step
 * with the site theme and the notebook skin's pen colour, and sizes each frame from
 * the height the board reports. The frames are sandboxed without same-origin, so
 * postMessage is the only channel.
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
    const sendTheme = (frame: HTMLIFrameElement) => {
      frame.contentWindow?.postMessage({ type: "wb-theme", theme: theme() }, "*");
      const accent = getComputedStyle(frame).getPropertyValue("--acc").trim();
      frame.contentWindow?.postMessage({ type: "wb-skin", skin: "notebook", accent }, "*");
    };

    const onMessage = (event: MessageEvent) => {
      const frame = frames.find((f) => f.contentWindow === event.source);
      if (!frame || event.data?.type !== "wb-height") return;
      const height = Number(event.data.height);
      if (Number.isFinite(height) && height > 0) {
        frame.style.height = `${Math.min(height, 4000)}px`;
      }
    };
    const onLoad = (event: Event) => sendTheme(event.target as HTMLIFrameElement);

    // "Open full screen" opens the board on its own page by default (iPhone Safari has
    // no element full screen). Where the browser allows it, go full screen in place and
    // ask for landscape, which is what makes the board readable on a phone.
    const onOpen = (event: MouseEvent) => {
      const figure = (event.currentTarget as HTMLElement).closest("figure");
      if (!figure || !document.fullscreenEnabled || !figure.requestFullscreen) return;
      event.preventDefault();
      figure
        .requestFullscreen()
        .then(() => {
          const orientation = screen.orientation as ScreenOrientation & {
            lock?: (o: string) => Promise<void>;
          };
          return orientation.lock?.("landscape");
        })
        .catch(() => {});
    };
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".post-content a.whiteboard-open"),
    );
    // The standalone board can't hear the site toggle, so its link carries the theme.
    const syncLinks = () =>
      links.forEach((link) => {
        const url = new URL(link.href);
        url.searchParams.set("theme", theme());
        link.href = url.toString();
      });

    window.addEventListener("message", onMessage);
    links.forEach((link) => link.addEventListener("click", onOpen));
    syncLinks();
    frames.forEach((frame) => {
      frame.addEventListener("load", onLoad);
      sendTheme(frame);
    });
    const observer = new MutationObserver(() => {
      frames.forEach(sendTheme);
      syncLinks();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("message", onMessage);
      links.forEach((link) => link.removeEventListener("click", onOpen));
      frames.forEach((frame) => frame.removeEventListener("load", onLoad));
      observer.disconnect();
    };
  }, []);

  return null;
}
