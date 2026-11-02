/** @type {import('tailwindcss').Config} */
const cssVar = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const neutralShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: Object.fromEntries(neutralShades.map((shade) => [shade, cssVar(`neutral-${shade}`)])),
        amber: {
          300: cssVar('amber-300'),
          400: cssVar('amber-400'),
        },
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
