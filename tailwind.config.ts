import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
      extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pe: {
          primary: "#1A6FBF",
          "primary-dark": "#145299",
          light: "#E8F4FD",
          accent: "#0D4A8C",
          surface: "#F5F8FB",
        },
      },
      boxShadow: {
        card: "0 2px 12px rgba(13, 74, 140, 0.08)",
        nav: "0 -4px 24px rgba(13, 74, 140, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
