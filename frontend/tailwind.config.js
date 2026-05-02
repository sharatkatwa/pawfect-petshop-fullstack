/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        base: ["Lexend", "sans-serif"],          // body text
        heading: ["Space Grotesk", "sans-serif"], // headings
      },
    },
  },
  plugins: [],
};