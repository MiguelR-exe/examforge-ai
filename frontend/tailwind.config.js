/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0a0a14",
          surface: "#12121f",
          raised: "#171727",
          border: "#23233a",
        },
        ink: {
          DEFAULT: "#e8e8f5",
          muted: "#9494b8",
          faint: "#5f5f80",
        },
        brand: {
          DEFAULT: "#6d6df7",
          dim: "#5858d6",
          glow: "#8b8bff",
        },
        good: "#34d399",
        warn: "#fbbf24",
        bad: "#f87171",
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(109,109,247,0.25), 0 8px 24px -8px rgba(109,109,247,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};