import scrollbarHide from "tailwind-scrollbar-hide";
const px0_200 = Array.from({ length: 1001 }, (_, idx) => [`${idx}px`]);

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/index.html"],
  theme: {
    extend: {
      fontSize: px0_200,
      width: px0_200,
      height: px0_200,
      colors: {
        "main-color": "#028090",
        "sub-color-blue": "#456990",
      },
    },
  },
  plugins: [scrollbarHide],
};
