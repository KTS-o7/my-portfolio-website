"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// ---------------------------------------------------------------------------
// localStorage-backed external store helpers
// ---------------------------------------------------------------------------

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getThemeSnapshot(): Theme {
  const val = localStorage.getItem("theme");
  if (val === "light" || val === "dark") return val;
  // No stored preference: respect the OS setting, fall back to light.
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getThemeServerSnapshot(): Theme {
  return "light";
}

// ---------------------------------------------------------------------------

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // useSyncExternalStore is the React-blessed API for reading browser storage.
  // It always returns the server snapshot during SSR / first-render so the
  // server and client initial renders agree, eliminating the hydration mismatch.
  const theme = useSyncExternalStore(
    subscribeToStorage,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  // Sync DOM classes for theme (pure external side-effect, no setState)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.setAttribute("data-palette", "gruvbox");
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    // Dispatch a storage event so useSyncExternalStore re-reads the snapshot
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
