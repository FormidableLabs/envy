/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
export default {
  darkMode: ['class'],
  content: ['./src/index.html', './src/**/*.tsx'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      slate: colors.slate,
      apple: {
        50: '#F3FBF2',
        100: '#E4F8E0',
        200: '#CAEFC3',
        300: '#9DE093',
        400: '#6CC95F',
        500: '#48AE39',
        600: '#378F2A',
        700: '#2D7124',
        800: '#275A21',
        900: '#214A1D',
        950: '#0D280B',
      },
      manatee: {
        50: '#F5F7F8',
        100: '#EEEFF1',
        200: '#DFE1E6',
        300: '#CBCFD6',
        400: '#B5B9C4',
        500: '#A1A5B3',
        600: '#8D90A1',
        700: '#787B8A',
        800: '#626471',
        900: '#52535D',
        950: '#303136',
      },
      shark: {
        50: '#E8EBEC',
        100: '#D8DCDF',
        200: '#B6BFC3',
        300: '#94A3A7',
        400: '#73878C',
        500: '#57686A',
        600: '#3C4849',
        700: '#202727',
        800: '#191F1E',
        900: '#121616',
        950: '#0F1212',
      },
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
