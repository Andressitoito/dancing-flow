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
          DEFAULT: 'var(--color-primary, #ff0000)',
          light: '#fb7185',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #ff9800)',
        },
      },
    },
  },
  plugins: [],
}
