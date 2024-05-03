import type { Config } from "tailwindcss";
// @ts-ignore
import animations from "@midudev/tailwind-animations";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        rubik: ["var(--font-rubik)"],
        "geist-sans": ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [animations],
};
export default config;
