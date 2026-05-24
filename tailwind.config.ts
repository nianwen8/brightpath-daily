import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skywash: "#e8f4ff",
        leaf: "#2f8f5b",
        coral: "#ef7b68",
        ink: "#243044",
        sun: "#ffd166"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(36, 48, 68, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
