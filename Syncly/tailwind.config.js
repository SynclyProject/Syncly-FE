import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/index.html"],
  theme: {
    extend: {
      colors: {
        "main-color": "#028090",
        "sub-color-blue": "#456990",
      },
    },
  },
  plugins: [scrollbarHide],
};
