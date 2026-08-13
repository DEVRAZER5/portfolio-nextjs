/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        accent: "#3498db",
        muted: "#555555",
        surface: "#f4f4f9",
      },
      fontFamily: {
        sans: ["Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
