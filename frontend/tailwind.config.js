/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yt-red': '#FF0000',
        'yt-black': '#212121',
        'yt-light-black': '#181818',
        'yt-gray': '#AAAAAA',
        'yt-light-gray': '#F9F9F9',
        'yt-dark': '#0F0F0F'
      },
      spacing: {
        '88': '22rem',
      }
    },
  },
  plugins: [],
}