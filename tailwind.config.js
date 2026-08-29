/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F4",
        "paper-dim": "#F1EFE6",
        ink: "#101F2B",
        "ink-soft": "#3C4F5C",
        line: "#DBD6C6",
        ready: {
          50: "#EAF3EC",
          100: "#CFE4D5",
          400: "#3E8F63",
          500: "#2C7A50",
          600: "#1F5F3E",
          700: "#164630",
        },
        signal: {
          50: "#FDF3E2",
          400: "#E3A538",
          500: "#C98A22",
          600: "#A56E15",
        },
        flag: {
          400: "#C24B4B",
          500: "#A83C3C",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(16,31,43,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(16,31,43,0.06), 0 12px 32px -16px rgba(16,31,43,0.18)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        tick: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        scan: "scan 2.4s linear infinite",
        tick: "tick 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
