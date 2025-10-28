/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        black: {
          DEFAULT: "#000000",
          100: "#000000",
          200: "#000000",
          300: "#000000",
          400: "#000000",
          500: "#000000",
          600: "#333333",
          700: "#666666",
          800: "#999999",
          900: "#cccccc",
        },
        onyx: {
          DEFAULT: "#363946",
          100: "#0b0b0e",
          200: "#15161c",
          300: "#202229",
          400: "#2b2d37",
          500: "#363946",
          600: "#575c71",
          700: "#7c819a",
          800: "#a7abbc",
          900: "#d3d5dd",
        },
        dim_gray: {
          DEFAULT: "#696773",
          100: "#151517",
          200: "#2a292e",
          300: "#3f3e46",
          400: "#54525d",
          500: "#696773",
          600: "#868492",
          700: "#a4a3ad",
          800: "#c3c1c8",
          900: "#e1e0e4",
        },
        cadet_gray: {
          DEFAULT: "#819595",
          100: "#1a1f1f",
          200: "#333d3d",
          300: "#4d5c5c",
          400: "#667a7a",
          500: "#819595",
          600: "#9babab",
          700: "#b4c0c0",
          800: "#cdd5d5",
          900: "#e6eaea",
        },
        ash_gray: {
          DEFAULT: "#b1b6a6",
          100: "#24261f",
          200: "#484c3e",
          300: "#6c725e",
          400: "#8f967f",
          500: "#b1b6a6",
          600: "#c0c4b7",
          700: "#d0d3c9",
          800: "#e0e2db",
          900: "#eff0ed",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gradient: "gradient 8s linear infinite",
        "border-beam": "border-beam 3s ease-in-out infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "border-beam": {
          "0%, 100%": {
            transform: "translateX(-100%)",
          },
          "50%": {
            transform: "translateX(100%)",
          },
        },
      },
      perspective: {
        1000: "1000px",
        2000: "2000px",
      },
    },
  },

  plugins: [],
};
