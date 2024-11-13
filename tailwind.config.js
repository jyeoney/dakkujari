// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./src/**/*.{js, jsx, ts, tsx}'],
//   theme: {
//     extend: {}
//   },
//   plugins: []
// };
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace']
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
