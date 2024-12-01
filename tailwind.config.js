/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        exo: ["Exo", "sans-serif"],
        jost: ["Jost", "sans-serif"],
      },
      fontSize: {
        h1: ["3rem", { lineHeight: "1.5" }], // 48px
        h2: ["2rem", { lineHeight: "1.5" }], // 32px
        h3: ["1.75rem", { lineHeight: "1.5" }], // 28px
        h4: ["1.25rem", { lineHeight: "1.5" }], // 20px
        h5: ["1rem", { lineHeight: "1.5" }], // 16px
        p: ["1.125rem", { lineHeight: "1.5" }], // 18px
        p2: ["1rem", { lineHeight: "1.5" }], // 16px
      },
      colors: {
        darkgrey: "#555555",
        grey: "#9D9D9D",
        lightgrey: "#EAEAEA",
        info: "#2580D5",
        success: "#55BE24",
        warning: "#F51A1A",
        primary: "#FF782D",
      },
      spacing: {
        "large-padding": "0.625rem 1.5rem", // 10px 24px
        "small-padding": "0.625rem 0.9375rem", // 10px 15px
        container: "81.25rem", // 1290px
      },
      lineHeight: {
        150: "1.5",
      },
      container: {
        center: true, 
        padding: {
          DEFAULT: "30rem", 
          sm: "2rem", 
          lg: "4rem", 
        },
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "body": {
          fontFamily: "Jost, sans-serif", 
        },
        "h1": {
          fontFamily: "Exo, sans-serif",
          fontSize: "3rem", // 48px
          lineHeight: "1.5",
        },
        "h2": {
          fontFamily: "Exo, sans-serif",
          fontSize: "2rem", // 32px
          lineHeight: "1.5",
        },
        "h3": {
          fontFamily: "Exo, sans-serif",
          fontSize: "1.75rem", // 28px
          lineHeight: "1.5",
        },
        "h4": {
          fontFamily: "Exo, sans-serif",
          fontSize: "1.25rem", // 20px
          lineHeight: "1.5",
        },
        "h5": {
          fontFamily: "Exo, sans-serif",
          fontSize: "1rem", // 16px
          lineHeight: "1.5",
        },
        "p": {
          fontFamily: "Jost, sans-serif",
          fontSize: "1.125rem", // 18px
          lineHeight: "1.5",
        },
      });
    },
  ],
};
