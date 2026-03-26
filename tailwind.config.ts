import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TimeBACK System Style Sheet
        brand: {
          // Backgrounds
          bg: "#0A0A0F",           // Background Dark — 240 10% 4%
          card: "#101018",          // Card Surface — 240 8% 7%
          "card-hover": "#16161F",  // Slightly lighter card hover
          surface: "#1A1A24",       // Elevated surface
          border: "#2A2A38",        // Border / divider
          "border-hover": "#3A3A4A",

          // Purple spectrum
          primary: "#A83AC4",       // Primary Purple — 287 54% 50%
          accent: "#8B3FD9",        // Accent Purple — 270 70% 55%
          secondary: "#7A3DB8",     // Secondary Purple — 270 50% 45%
          "primary-light": "#C45FE0",
          "accent-glow": "rgba(139, 63, 217, 0.3)",

          // Text
          fg: "#F2F2F2",            // Foreground — body text
          muted: "#87878E",         // Muted Text — captions
          "muted-light": "#A0A0A8",
          light: "#FAFAFA",         // Light BG

          // Functional
          green: "#10B981",
          red: "#EF4444",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #A83AC4, #5B21B6)",
        "accent-gradient": "linear-gradient(135deg, #8B3FD9, #A855F7)",
        "subtle-gradient": "linear-gradient(180deg, #101018, #0A0A0F)",
      },
      boxShadow: {
        "brand-glow": "0 0 24px rgba(168, 58, 196, 0.25)",
        "accent-glow": "0 0 16px rgba(139, 63, 217, 0.3)",
        "card-glow": "0 0 32px rgba(168, 58, 196, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.35s ease-out",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 58, 196, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(168, 58, 196, 0.3)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
