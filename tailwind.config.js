/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
            pre: { padding: '0', margin: '0', backgroundColor: 'transparent' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
