/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base — matches reference site
        canvas: "#0F0F0F",
        "canvas-mid": "#161616",
        "canvas-card": "#1A1A1A",
        "canvas-raised": "#222222",
        "canvas-border": "#2A2A2A",
        "canvas-muted": "#333333",
        // Text
        "text-primary": "#F5F5F5",
        "text-secondary": "#999999",
        "text-muted": "#666666",
        // Gold accent — exact reference color
        gold: {
          50: "#FFF8E7",
          100: "#FEEFC3",
          200: "#FDE18A",
          300: "#FACA47",
          400: "#D4A72C",
          500: "#B8922A",   // primary CTA
          600: "#956F1A",
          700: "#6E4E10",
        },
        // Green accent for success states
        emerald: {
          400: "#3E8F63",
          500: "#2C7A50",
        },
        // Red for errors
        rose: {
          400: "#C24B4B",
          500: "#A83C3C",
        },
        // Legacy aliases kept for components not yet migrated
        paper: "#F5F5F5",
        "paper-dim": "#1A1A1A",
        ink: "#F5F5F5",
        "ink-soft": "#999999",
        line: "#2A2A2A",
        ready: {
          50: "#1A2A1F",
          100: "#1F3327",
          400: "#3E8F63",
          500: "#2C7A50",
          600: "#B8922A",  // maps to gold in dark theme
          700: "#956F1A",
        },
        signal: {
          50: "#1F1A0A",
          400: "#D4A72C",
          500: "#B8922A",
          600: "#956F1A",
        },
        flag: {
          400: "#C24B4B",
          500: "#A83C3C",
        },
      },
      fontFamily: {
        display: ["\"Crimson Pro\"", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "\"IBM Plex Mono\"", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)",
        "panel-hover": "0 0 0 1px rgba(184,146,42,0.3), 0 8px 32px rgba(0,0,0,0.6)",
        gold: "0 0 0 1px rgba(184,146,42,0.4)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ping: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.4" },
        },
        tick: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        ping: "ping 1.5s ease-in-out infinite",
        tick: "tick 0.4s ease-in-out",
        scan: "scan 2.4s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
