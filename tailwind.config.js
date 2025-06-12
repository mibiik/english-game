const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
     colors: {
        'ocean-blue': {
          DEFAULT: '#0066cc',
          light: '#0099ff',
          dark: '#003366'
        },
        'sea-green': {
          DEFAULT: '#2e8b57',
          light: '#3cb371',
          dark: '#006400'
        },
        'sky-blue': {
          DEFAULT: '#87ceeb',
          light: '#b0e0e6',
          dark: '#4682b4'
        },
        'dark': {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a',
          lighter: '#2a2a2a'
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'sparkle': 'sparkle 10s linear infinite'
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #0066cc, 0 0 15px #0099ff, 0 0 20px #87ceeb' },
          '50%': { textShadow: '0 0 8px #2e8b57, 0 0 20px #3cb371, 0 0 30px #006400' },
          '100%': { textShadow: '0 0 10px #4682b4, 0 0 25px #b0e0e6, 0 0 35px #003366' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'sparkle': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.2) rotate(180deg)' },
          '100%': { transform: 'scale(1) rotate(360deg)' }
        }
      },
      boxShadow: {
        'ocean-glow': '0 0 5px #0066cc, 0 0 20px #0099ff',
        'sea-glow': '0 0 5px #2e8b57, 0 0 20px #3cb371',
        'sky-glow': '0 0 5px #87ceeb, 0 0 20px #b0e0e6'
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
