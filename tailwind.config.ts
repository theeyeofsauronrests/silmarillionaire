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
          base: "#f8f3e8",
          ink: "#2f261b",
          border: "#cdb89a",
          gold: "#b88b3c",
          green: "#2e4f3f"
        }
      },
      boxShadow: {
        parchment: "0 1px 0 #ffffff, 0 0 0 1px rgba(176, 143, 94, 0.25)"
      },
      backgroundImage: {
        "parchment-grain":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6) 0 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(189,157,112,0.08) 0 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
