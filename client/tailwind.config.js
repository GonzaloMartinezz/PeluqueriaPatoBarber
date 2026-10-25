/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00E5FF',
          dim: 'rgba(0, 229, 255, 0.12)',
          mid: 'rgba(0, 229, 255, 0.35)',
        },
        dark: {
          bg: '#0a0a0c',
          surface: '#111115',
          surface2: '#18181e',
          border: 'rgba(0, 229, 255, 0.15)',
        }
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
