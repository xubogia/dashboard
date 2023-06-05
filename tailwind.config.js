/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1060px', // 64 + 680 + 16 + 300
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        gradient: `radial-gradient(ellipse at center, ${colors.blue[400]} 0%, ${colors.gray[100]} 65%)`,
      },
      borderRadius: {
        '4xl': '2rem',
      },

      spacing: {
        26: '6.5rem',
        110: '26.5rem',
        120: '30rem',
        170: '42.5rem',
      },
      colors: {
        teal: '#00ab9f',
      },
      borderWidth: {
        0: '0',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
      },
    },
  },
  plugins: [],
};
