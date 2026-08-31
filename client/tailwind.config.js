/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070C1E',
          850: '#0B132B',
          800: '#111D42',
          700: '#1C2541',
          600: '#2A3B66',
          500: '#3A506B',
        },
        brand: {
          50: '#EEF6FF',
          100: '#D9ECFF',
          200: '#BCE0FD',
          300: '#8ECDFA',
          400: '#53B3F7',
          500: '#0066FF',
          600: '#0052CC',
          700: '#0040A3',
          800: '#003380',
          900: '#002661',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 31, 84, 0.08), 0 8px 10px -6px rgba(0, 31, 84, 0.04)',
        'premium-lg': '0 20px 35px -10px rgba(0, 31, 84, 0.12), 0 10px 15px -5px rgba(0, 31, 84, 0.06)',
        'glow': '0 0 20px rgba(0, 102, 255, 0.25)',
      }
    },
  },
  plugins: [],
}