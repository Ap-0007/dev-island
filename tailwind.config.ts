import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        island: {
          water: "#1a3a5c",
          waterDeep: "#0d2137",
          sand: "#c2b280",
          grass: "#4a7c59",
          tree: "#2d5a27",
          forest: "#1a3d1a",
          structure: "#d4a017",
          structureGlow: "#f5c542",
        },
        surface: {
          DEFAULT: "#111827",
          light: "#1f2937",
          lighter: "#374151",
        },
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          glow: "#4f46e5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "wave": "wave 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)" },
        },
        wave: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-2px) rotate(1deg)" },
          "75%": { transform: "translateY(2px) rotate(-1deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
