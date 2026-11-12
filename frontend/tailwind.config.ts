import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Landing-page palette (navy + purple), exposed as Tailwind theme
        ink: {
          DEFAULT: '#0E1A55',
          900: '#0B1440',
          800: '#13236B',
          700: '#1B2E80',
          600: '#243A96',
          500: '#2A4FD6',
          400: '#4A6BEC',
          300: '#7A94F0',
          200: '#B9C8F8',
          100: '#E6EBFA',
          50: '#F3F6FF',
        },
        brand: {
          DEFAULT: '#003366', // navy base
          900: '#071C6B',
          800: '#0B2378',
          600: '#143A8F',
          500: '#1E4BA6',
          400: '#2A4FD6',
          300: '#4A6BEC',
          200: '#7A94F0',
          100: '#B9C8F8',
          50: '#F3F6FF',
        },
        accent: {
          DEFAULT: '#803688', // purple accent (landing page)
          900: '#5A2560',
          800: '#6B2E78',
          700: '#7C3790',
          600: '#8D40A8',
          500: '#9E49C0',
          400: '#B06AD6',
          300: '#C994E8',
          200: '#E2C2F0',
          100: '#F3E6F6',
          50: '#FBF5FC',
        },
        ice: {
          DEFAULT: '#EEF2FF',
          50: '#F7F9FF',
        },
        // Legacy aliases kept for existing class names
        navy: {
          DEFAULT: '#003366',
          800: '#071C6B',
          600: '#2A4FD6',
          50: '#EEF2FF',
        },
        red: {
          DEFAULT: '#803688',
          900: '#5A2560',
          600: '#803688',
          50: '#F3E6F6',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        caveat: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        '3d': '0 6px 0 rgba(7,28,107,.45)',
        '3d-red': '0 6px 0 rgba(90,37,96,.55)',
      },
      borderRadius: {
        'xl-plus': '16px',
      },
    },
  },
  plugins: [],
};

export default config;