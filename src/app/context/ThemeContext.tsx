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
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
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
  }, [theme]);

  const setTheme = (next: Theme) => {
    localStorage.setItem("theme", next);
    // Dispatch a storage event so useSyncExternalStore re-reads the snapshot
    window.dispatchEvent(new Event("storage"));
  };
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
