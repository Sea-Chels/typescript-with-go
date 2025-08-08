/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f23',
          surface: '#1a1b3a',
          hover: '#262648',
          border: '#2d2e5f',
          text: '#e1e1e3',
          muted: '#9ca3af',
        },
        accent: {
          primary: '#7c3aed',
          hover: '#6d28d9',
          light: '#a78bfa',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#9333ea',
          pink: '#ec4899',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(124, 58, 237), 0 0 10px rgb(124, 58, 237)' },
          '100%': { boxShadow: '0 0 10px rgb(124, 58, 237), 0 0 20px rgb(124, 58, 237)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}