import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "wood-warm": "#C4956A",
        "wood-deep": "#8B6245",
        "wood-light": "#D4A574",
        beige: "#F5F0E8",
        stone: "#E8E2D9",
        cream: "#FAFAF7",
        charcoal: "#1C1C1C",
        ink: "#2D2D2D",
        "whatsapp-green": "#25D366",
        "overlay-dark": "rgba(28, 28, 28, 0.55)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        arabic: ["var(--font-cairo)", "Arial", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        "section": "6rem",
        "section-lg": "8rem",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      transitionDuration: {
        "600": "600ms",
        "800": "800ms",
      },
      backgroundImage: {
        "wood-grain": "url('/media/images/masqool-hero-07.jpeg')",
      },
    },
  },
  plugins: [],
};
export default config;

