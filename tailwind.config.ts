import type { Config } from "tailwindcss";

const config: Config = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#45B69C",
          "secondary": "#c2410c",
          "accent": "#93c5fd",
          "neutral": "#1f2937",
          "base-100": "#f3f4f6",
          "info": "#0891b2",
          "success": "#86efac",
          "warning": "#fb923c",
          "error": "#7c2d12",
        },
      },
    ],
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;