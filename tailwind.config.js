/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#E8610A",
        teal:    "#006E6D",
        ivory:   "#FFF8EF",
        crimson: "#B5281C",
        forest:  "#2D6A2F",
        slate:   "#1C1C1C",
        sand:    "#E8D5A8",
        mist:    "#D9CFC3",
      },
      fontFamily: {
        display: ['"Yatra One"', "Georgia", "serif"],
        sans:    ["Poppins", "system-ui", "sans-serif"],
        mono:    ['"JetBrains Mono"', "monospace"],
      },
      maxWidth: { content: "1280px" },
      keyframes: {
        enter: {
          from: { opacity:"0", transform:"translateY(20px)" },
          to:   { opacity:"1", transform:"translateY(0)" },
        },
        fadeIn: {
          from: { opacity:"0" },
          to:   { opacity:"1" },
        },
      },
      animation: {
        enter:  "enter 0.5s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 0.4s ease both",
      },
    },
  },
  plugins: [],
};