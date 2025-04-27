import scrollbarHide from "tailwind-scrollbar-hide";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css}", "./index.html"],
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

export default config;
