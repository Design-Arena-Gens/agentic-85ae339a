import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0f172a",
        dusk: "#1e293b",
        sunset: "#fb7185",
        meadow: "#34d399",
        sky: "#38bdf8"
      }
    }
  },
  plugins: [],
};

export default config;
