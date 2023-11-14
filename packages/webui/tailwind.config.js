/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/index.html', './src/**/*.tsx'],
  theme: {
    gap: {
      0: '0px',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
      24: '1.5rem',
    },
    padding: {
      0: '0px',
      2: '0.125rem',
      4: '0.25rem',
      6: '0.375rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
    },
    radius: {
      0: '0px',
      2: '0.125rem',
      4: '0.25rem',
      8: '0.5rem',
      16: '1rem',
    },
    space: {
      0: '0px',
      1: '1px',
      6: '0.375rem',
      24: '1.5rem',
      48: '3rem',
      96: '6rem',
      192: '12rem',
      240: '15rem',
      320: '20rem',
    },
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
  plugins: [require('@tailwindcss/forms')],
};
