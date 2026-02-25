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
          base: "#6e6e5f",
          ink: "#fffafa",
          border: "#e1e1d7",
          gold: "#ff784b",
          green: "#5fe69b"
        }
      },
      boxShadow: {
        parchment: "0 0 0 1px rgba(225, 225, 215, 0.2), 0 12px 24px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "parchment-grain":
          "linear-gradient(rgba(255,250,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,250,250,0.04) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
