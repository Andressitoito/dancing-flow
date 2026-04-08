/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',
        primary: {
          DEFAULT: '#e11d48', // Bachata Rose
          light: '#fb7185',
        },
        secondary: {
          DEFAULT: '#fbbf24', // Tropical Amber
        },
      },
    },
  },
  plugins: [],
}
