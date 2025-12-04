/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0b',
          secondary: '#111113',
          tertiary: '#1a1a1d',
        },
        border: {
          DEFAULT: '#2a2a2d',
          hover: '#3a3a3d',
        },
        accent: {
          DEFAULT: '#ff3d3d',
          hover: '#ff5555',
          muted: 'rgba(255, 61, 61, 0.125)',
        },
      },
    },
  },
  plugins: [],
};

