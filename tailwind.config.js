/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Design tokens live as CSS variables in globals.css (light and dark).
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        tx: "var(--tx)",
        tx2: "var(--tx2)",
        acc: "var(--acc)",
        rule: "var(--rule)",
        rule2: "var(--rule2)",
        code: "var(--code)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      screens: {
        // Below 720px the margin column collapses (see globals.css).
        m: { max: "719.98px" },
      },
    },
  },
  plugins: [],
};
