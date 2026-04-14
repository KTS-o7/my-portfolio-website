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
  palette: string;
  setPalette: (key: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  palette: "forestPink",
  setPalette: () => {},
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
  return val === "light" ? "light" : "dark";
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function getPaletteSnapshot(): string {
  return localStorage.getItem("palette") || "forestPink";
}

function getPaletteServerSnapshot(): string {
  return "forestPink";
}

// ---------------------------------------------------------------------------

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // useSyncExternalStore is the React-blessed API for reading browser storage.
  // It always returns the server snapshot during SSR / first-render so the
  // server and client initial renders agree, eliminating the hydration mismatch.
  // After hydration it reads the live localStorage value and re-renders once if
  // it differs — this is safe because it's driven by the store, not setState
  // inside an effect.
  const theme = useSyncExternalStore(
    subscribeToStorage,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const palette = useSyncExternalStore(
    subscribeToStorage,
    getPaletteSnapshot,
    getPaletteServerSnapshot,
  );

  // Sync DOM classes for theme (pure external side-effect, no setState)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  // Sync palette data attribute (pure external side-effect, no setState)
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", palette);
  }, [palette]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    // Dispatch a storage event so useSyncExternalStore re-reads the snapshot
    window.dispatchEvent(new Event("storage"));
  };

  const setPalette = (key: string) => {
    localStorage.setItem("palette", key);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};
