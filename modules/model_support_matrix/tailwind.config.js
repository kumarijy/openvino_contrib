/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'openvino-purple': '#7E4DD2',
        'openvino-blue': '#0068B5',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}
