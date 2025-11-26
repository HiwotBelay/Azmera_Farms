import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#34D399",
        },
        accent: {
          yellow: "#FBBF24",
          blue: "#3B82F6",
        },
      },
    },
  },
  plugins: [],
};
export default config;



