import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        // Toast animations
        swipeOut: "swipeOut 0.5s ease-out",
        slideIn: "slideIn 0.5s ease-out",
        slideOut: "slideOut 0.5s ease-out",
      },
      keyframes: {
        // Swipe out animation for toast
        swipeOut: {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": { transform: "translateX(100%)" },
        },
        // Slide in from bottom right
        slideIn: {
          "0%": {
            transform: "translateX(100%) translateY(20px)",
            opacity: "0",
          },
          "100%": { transform: "translateX(0) translateY(0)", opacity: "1" },
        },
        // Slide out to bottom right
        slideOut: {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "1" },
          "100%": {
            transform: "translateX(100%) translateY(20px)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
