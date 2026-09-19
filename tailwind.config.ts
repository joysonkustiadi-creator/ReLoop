import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#163A32", accent: "#2F7D68", canvas: "#F7F8F5", ink: "#1F2933" },
      fontFamily: { sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
