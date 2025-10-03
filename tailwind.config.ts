import type { Config } from 'tailwindcss';

export default {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        zoomPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(0.75)',
          },
        },
        swingRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(-20deg)' },
          '30%': { transform: 'rotate(15deg)' },
          '45%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(6deg)' },
          '75%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 3s ease-in-out forwards',
        zoomPulse: 'zoomPulse 2s ease-in-out infinite',
        swingRotate: 'swingRotate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
} satisfies Config;
