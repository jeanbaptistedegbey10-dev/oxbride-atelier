import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidienne: "#1A1D24",
        "champagne-perle": "#EBE5DF",
        "sable-or-rose": "#D9C7B8",
        "gris-ebene": "#232529",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        cinzel: ["var(--font-cinzel)"],
      },
    },
  },
  plugins: [],
};

export default config;
