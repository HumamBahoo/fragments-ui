/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    fontSize: {
      sm: '0.9rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2.75rem',
      '3xl': '2rem',
      '4xl': '2.25rem',
      '5xl': '2.5rem',
      h1: ['2.5rem', { fontWeight: '1000' }],
      h2: ['2.25rem', { fontWeight: '800' }],
      h3: ['2rem', { fontWeight: '700' }],
      h4: ['1.75rem', { fontWeight: '600' }],
      h5: ['1.5rem', { fontWeight: '500' }],
      h6: ['1.25rem', { fontWeight: '400' }],
    },
  },
  plugins: [],
};
