/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
      h1: ['2.5rem', { fontWeight: '1000' }],
      h2: ['2.25rem', { fontWeight: '900' }],
      h3: ['2rem', { fontWeight: '800' }],
      h4: ['1.75rem', { fontWeight: '700' }],
      h5: ['1.5rem', { fontWeight: '600' }],
      h6: ['1.25rem', { fontWeight: '500' }],
    },
  },
  plugins: [],
};
