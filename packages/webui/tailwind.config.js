/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-mode="dark"]'],
  content: ['./src/index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.6rem', '0.9rem'],
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [],
};
