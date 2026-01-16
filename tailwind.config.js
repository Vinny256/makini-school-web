/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'makini-blue': '#1e3a8a',
        'makini-yellow': '#facc15',
      },
    },
  },
  plugins: [],
}