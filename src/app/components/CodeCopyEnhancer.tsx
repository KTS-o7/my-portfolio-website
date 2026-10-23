"use client";

import { useEffect } from "react";

/**
 * Enhances rendered markdown code blocks with a copy-to-clipboard button.
 * Mounts once on the blog post page and wraps every <pre> inside .post-content
 * in a positioned box, so the button stays put while the code scrolls sideways.
 */
export default function CodeCopyEnhancer() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLElement>(".post-content pre");
    const cleanups: (() => void)[] = [];

    pres.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block";
      pre.replaceWith(wrapper);
      wrapper.appendChild(pre);

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
      wrapper.appendChild(btn);

      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        btn.remove();
        wrapper.replaceWith(pre);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
