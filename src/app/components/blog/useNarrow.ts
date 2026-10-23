"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 719.98px)";

const subscribe = (callback: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

// True below 720px, where the margin column collapses. False during server render.
export const useNarrow = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
