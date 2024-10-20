// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        exo: ['Exo', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
      },
      fontSize: {
        h1: ['3rem', { lineHeight: '1.5' }], // 48px
        h2: ['2rem', { lineHeight: '1.5' }], // 32px
        h3: ['1.75rem', { lineHeight: '1.5' }], // 28px
        h4: ['1.25rem', { lineHeight: '1.5' }], // 20px
        h5: ['1rem', { lineHeight: '1.5' }], // 16px
        p: ['1.125rem', { lineHeight: '1.5' }], // 18px
        p2: ['1rem', { lineHeight: '1.5' }], // 16px
      },
      colors: {
        darkgrey: '#555555',
        grey: '#9D9D9D',
        lightgrey: '#EAEAEA',
        info: '#2580D5',
        success: '#55BE24',
        warning: '#F51A1A',
        primary: '#FFAB2D',
      },
      spacing: {
        'large-padding': '0.625rem 1.5rem', // 10px 24px
        'small-padding': '0.625rem 0.9375rem', // 10px 15px
        'container': '81.25rem', // 1290px
      },
      lineHeight: {
        '150': '1.5',
      },
    },
  },
  plugins: [

    function ({ addBase }) {
      addBase({
        'body': {
          fontFamily: 'Jost, sans-serif', // Шрифт по умолчанию для всего текста
        },
        'h1, h2, h3, h4, h5': {
          fontFamily: 'Exo, sans-serif', // Шрифт для заголовков
        },
        'h1.large': {
          fontFamily: 'Exo, sans-serif', 
        },
      });
    },
  ],
}
