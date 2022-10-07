/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

const fromVariable = variable => {
  return `rgb(var(--${variable}) / <alpha-value>)`;
};

module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: fromVariable("bg-primary"),
        secondary: fromVariable("bg-secondary"),
        tertiary: fromVariable("bg-tertiary"),
      },
      textColor: {
        primary: fromVariable("text-primary"),
        dim: fromVariable("text-dim"),
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addVariant }) {
      addVariant("can-hover", "@media (hover: hover)");
    }),
  ],
  darkMode: "class",
};
