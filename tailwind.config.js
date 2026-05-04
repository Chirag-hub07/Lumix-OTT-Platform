/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#070B14',
          2: '#0C1120',
          3: '#111827',
          4: '#1A2235',
          5: '#243048',
        },
        acc: {
          DEFAULT: '#7C3AED',
          2: '#9B5CF6',
        },
        cyan: '#06B6D4',
        emerald: '#10B981',
        amber: '#F59E0B',
        rose: '#F43F5E',
        t1: '#F1F5FF',
        t2: '#94A3C0',
        t3: '#4B5A75',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'fade-in': 'fadeIn 0.28s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
