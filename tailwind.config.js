const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
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
  			dark: {
  				DEFAULT: '#0a0a0a',
  				light: '#1a1a1a',
  				lighter: '#2a2a2a'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			glow: 'glow 2s ease-in-out infinite alternate',
  			float: 'float 3s ease-in-out infinite',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'gradient-xy': 'gradient-xy 15s ease infinite',
  			sparkle: 'sparkle 10s linear infinite',
  			'fade-in-out': 'fadeInOut 0.8s ease-in-out forwards'
  		},
  		keyframes: {
  			glow: {
  				'0%': {
  					textShadow: '0 0 5px #0066cc, 0 0 15px #0099ff, 0 0 20px #87ceeb'
  				},
  				'50%': {
  					textShadow: '0 0 8px #2e8b57, 0 0 20px #3cb371, 0 0 30px #006400'
  				},
  				'100%': {
  					textShadow: '0 0 10px #4682b4, 0 0 25px #b0e0e6, 0 0 35px #003366'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
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
  			sparkle: {
  				'0%': {
  					transform: 'scale(1) rotate(0deg)'
  				},
  				'50%': {
  					transform: 'scale(1.2) rotate(180deg)'
  				},
  				'100%': {
  					transform: 'scale(1) rotate(360deg)'
  				}
  			},
  			fadeInOut: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px) scale(0.8)'
  				},
  				'20%': {
  					opacity: '0.3',
  					transform: 'translateY(0) scale(1)'
  				},
  				'80%': {
  					opacity: '0.3',
  					transform: 'translateY(-20px) scale(1)'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'translateY(-40px) scale(0.8)'
  				}
  			}
  		},
  		boxShadow: {
  			'ocean-glow': '0 0 5px #0066cc, 0 0 20px #0099ff',
  			'sea-glow': '0 0 5px #2e8b57, 0 0 20px #3cb371',
  			'sky-glow': '0 0 5px #87ceeb, 0 0 20px #b0e0e6'
  		},
  		fontFamily: {
  			outfit: ['"Outfit"', 'sans-serif'],
  			inter: ['"Inter"', 'sans-serif'],
  			poppins: ['"Poppins"', 'sans-serif'],
  			heading: ['"Montserrat"', 'sans-serif'],
  			'sans': ['"Inter"', 'sans-serif'],
  			bebas: ['"Bebas Neue"', 'cursive'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
