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
        soft: '#C6D2F8',
        mute: '#4F5C96',
        // Mirrors the --gray-* tokens in globals.css so Tailwind utilities
        // resolve to exactly the same colours as the hand-written CSS.
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
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
      backgroundImage: {
        grad: 'linear-gradient(135deg,#803688 0%,#A24BA8 100%)',
        'sidebar-wash':
          'radial-gradient(ellipse 190px 160px at 108% 104%, #EDE3EF 97%, transparent 100%), radial-gradient(circle 90px at -10% 86%, #F4ECF6 97%, transparent 100%), radial-gradient(ellipse 150px 120px at 106% -2%, #EEF1FB 97%, transparent 100%)',
        // the same soft brand washes, scaled up for a full page
        'page-wash':
          'radial-gradient(ellipse 440px 320px at 98% 1%, #EDE3EF 97%, transparent 100%), radial-gradient(circle 260px at -3% 44%, #F4ECF6 97%, transparent 100%), radial-gradient(ellipse 400px 280px at 3% 99%, #EEF1FB 97%, transparent 100%)',
        'topbar-wash':
          'radial-gradient(ellipse 150px 90px at 96% -40%, #EDE3EF 97%, transparent 100%)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        dm: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        caveat: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        '3d': '0 6px 0 rgba(7,28,107,.45)',
        '3d-red': '0 6px 0 rgba(90,37,96,.55)',
        // Hard "sticker" shadows used by the app chrome
        'sb-soft-1': '0 1px 0 #C6D2F8',
        'sb-soft-4': '0 4px 0 #C6D2F8',
        'sb-soft-5': '0 5px 0 #C6D2F8',
        'sb-soft-6': '0 6px 0 #C6D2F8',
        'sb-pur-1': '0 1px 0 #5A2560',
        'sb-pur-3': '0 3px 0 #5A2560',
        'sb-pur-4': '0 4px 0 #5A2560',
        'sb-pur-5': '0 5px 0 #5A2560',
        'sb-note': '4px 5px 0 #5A2560',
        'sb-float': '10px 0 22px -10px rgba(0,51,102,.22)',
        'sb-drawer': '6px 0 24px rgba(0,40,79,.25)',
      },
      borderRadius: {
        'xl-plus': '16px',
      },
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'skeleton-pulse': 'skeleton-pulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;