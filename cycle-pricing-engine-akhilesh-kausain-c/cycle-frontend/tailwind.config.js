/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#6d96a7',
        customBlueNormal:"#263e4f"
      },
    },
  },
  plugins: [],
}