/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary color
        'brand': {
          DEFAULT: '#006F6F',
          50: '#E6F5F5',
          100: '#CCE0E0',
          200: '#99C1C1',
          300: '#66A2A2',
          400: '#338383',
          500: '#006F6F',
          600: '#005959',
          700: '#004343',
          800: '#002D2D',
          900: '#001717',
        },
        // Success colors (for badges, alerts, etc)
        'success': {
          DEFAULT: '#91D6A8',
          bg: '#004617',
          text: '#91D6A8',
        },
        // Status pill background colors
        'vat-bg': '#FFF6ED',
        'filing-bg': '#F9F9F9',
      },
    },
  },
  plugins: [],
}
