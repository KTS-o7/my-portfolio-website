"use client";

import { useEffect } from "react";

/**
 * Enhances rendered markdown code blocks with a copy-to-clipboard button.
 * Mounts once on the blog post page and decorates every <pre> inside
 * .post-content. Server-rendered HTML is untouched.
 */
export default function CodeCopyEnhancer() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLElement>(".post-content pre");
    const cleanups: (() => void)[] = [];

    pres.forEach((pre) => {
      if (pre.querySelector(".copy-code-btn")) return;
      pre.classList.add("has-copy-btn");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-code-btn";
      btn.textContent = "copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");

      const onClick = async () => {
        const code = pre.querySelector("code")?.innerText ?? pre.innerText;
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = "copied";
        } catch {
          btn.textContent = "failed";
        }
        setTimeout(() => {
          btn.textContent = "copy";
        }, 1500);
      };

      btn.addEventListener("click", onClick);
      pre.appendChild(btn);

      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        btn.remove();
        pre.classList.remove("has-copy-btn");
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
