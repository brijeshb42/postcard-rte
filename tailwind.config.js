const colors = require("tailwindcss/colors");

module.exports = {
  purge: process.env.NODE_ENV === 'development' ? false : {
    content: ['./index.html', './src/**/*.tsx'],
    options: {
      safelist: ['font-firasans'],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        firasans: '\'Fira Sans\', sans',
        inter: '\'Inter\', sans-serif',
      },
      colors: {
        modo: {
          DEFAULT: '#13A4EC',
        },
        modoGray: {
          DEFAULT: '#aab2bb',
        },
        blueGray: colors.blueGray
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

