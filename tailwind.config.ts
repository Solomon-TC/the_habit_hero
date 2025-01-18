import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3498db',
          50: '#ebf5fb',
          100: '#d6eaf8',
          200: '#aed6f1',
          300: '#85c1e9',
          400: '#5dade2',
          500: '#3498db',
          600: '#2980b9',
          700: '#1f6797',
          800: '#154f75',
          900: '#0b3653',
          950: '#061f30',
        },
      },
    },
  },
  plugins: [],
};

export default config;
