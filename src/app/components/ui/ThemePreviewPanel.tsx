"use client";
import React, { useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { paletteLabels, themePalettes } from "@/lib/themes";

export const ThemePreviewPanel = () => {
  const { palette, setPalette, theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 rounded-full border border-text-tertiary/30 bg-surface/80 backdrop-blur text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-all"
        >
          Palettes
        </button>
      ) : (
        <div className="surface-card p-3 w-56 max-h-80 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Palette
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-text-tertiary hover:text-text-primary text-xs"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            {Object.entries(paletteLabels).map(([key, label]) => {
              const tokens =
                themePalettes[key]?.[theme === "light" ? "light" : "dark"];
              return (
                <button
                  key={key}
                  onClick={() => setPalette(key)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all ${
                    palette === key
                      ? "bg-surface text-text-primary border border-text-tertiary/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 border border-text-tertiary/20"
                    style={{ backgroundColor: tokens?.primary || "#888" }}
                  />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
