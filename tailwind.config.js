/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B0B13',
        accent: '#39D0D8',
      },
    },
  },
  plugins: [],
};
