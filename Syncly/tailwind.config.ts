import scrollbarHide from "tailwind-scrollbar-hide";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css}", "./index.html"],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        "main-color": "#028090",
        "sub-color-blue": "#456990",
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
