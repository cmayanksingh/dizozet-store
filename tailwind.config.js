/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#a1e3d8', // Main primary user color
          300: '#7be0d2',
          400: '#4cd3c2',
          500: '#26beac',
          600: '#0d9488', // Deep teal for readable text/borders
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        brand: {
          accent: '#a1e3d8',
          dark: '#0f172a',
          teal: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -3px rgba(161, 227, 216, 0.45)',
        'glow-lg': '0 0 30px -5px rgba(161, 227, 216, 0.6)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 40px -10px rgba(13, 148, 136, 0.12)',
      }
    },
  },
  plugins: [],
}
