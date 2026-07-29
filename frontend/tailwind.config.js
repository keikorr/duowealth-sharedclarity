/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': '#051424',
        'surface-container': '#122131',
        'surface-container-low': '#0d1c2d',
        'surface-container-high': '#1c2b3c',
        'surface-container-lowest': '#010f1f',
        'surface-variant': '#273647',
        'on-surface': '#d4e4fa',
        'on-surface-variant': '#bbcabf',
        'primary': '#4edea3',
        'on-primary': '#003824',
        'on-primary-container': '#00422b',
        'primary-container': '#10b981',
        'secondary': '#adc6ff',
        'secondary-container': '#0566d9',
        'on-secondary': '#002e6a',
        'on-secondary-container': '#e6ecff',
        'tertiary': '#d0bcff',
        'tertiary-container': '#b090ff',
        'error': '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'outline': '#86948a',
        'outline-variant': '#3c4a42',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'card': '0.5rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'unit': '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        'gutter': '24px',
      }
    },
  },
  plugins: [],
};
