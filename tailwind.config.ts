import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05060d",
          panel: "#0b0f1f",
          border: "#1b2440",
          cyan: "#00f0ff",
          magenta: "#ff2ec4",
          purple: "#8b5cf6",
          yellow: "#facc15",
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        neon: "0 0 12px rgba(0,240,255,0.6), 0 0 30px rgba(255,46,196,0.25)",
      },
      animation: {
        scan: "scan 4s linear infinite",
        flicker: "flicker 3s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 18%, 22%, 25%, 53%, 57%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
