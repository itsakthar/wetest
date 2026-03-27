/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        accent: "#4f7fff",
        accent2: "#a259ff",
        green: "#22d3a0",
        yellow: "#f5c842",
        red: "#f05a6e",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "floatY 6s ease-in-out infinite",
        "gradient": "gradientShift 4s ease infinite",
        "fade-up": "fadeUp 0.5s ease both",
        "scale-in": "scaleIn 0.4s ease both",
      },
      keyframes: {
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
