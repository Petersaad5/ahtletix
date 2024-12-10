/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D1F4B", // Dark blue from the logo
          light: "#122b6d", // Slightly lighter blue
          dark: "#0A1736", // Very dark blue for accents
        },
        secondary: {
          DEFAULT: "#FF6A00", // Orange from the logo
          light: "#FF8C33", // Lighter orange
          dark: "#CC5500", // Darker orange
        },
        neutral: {
          light: "#FFFFFF", // White for backgrounds and highlights
          DEFAULT: "#1C1C1C", // Dark gray for text
          dark: "#0A0A0A", // Almost black for deep contrast
        },
        danger: {
          DEFAULT: "#D90429", // Red for any errors or alerts
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Clean, professional font remains the same
      },
      boxShadow: {
        sidebar: "2px 0 5px rgba(0, 0, 0, 0.1)", // Shadow remains the same
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
