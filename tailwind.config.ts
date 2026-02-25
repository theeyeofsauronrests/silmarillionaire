import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          base: "#0b0d10",
          ink: "#f5f7fa",
          border: "#2a2f37",
          gold: "#d7dce3",
          green: "#9ea8b7"
        }
      },
      boxShadow: {
        parchment: "0 0 0 1px rgba(215, 220, 227, 0.12), 0 16px 32px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "parchment-grain":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
