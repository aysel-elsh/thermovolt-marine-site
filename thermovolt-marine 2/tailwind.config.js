/** @type {import('tailwindcss').Config} */
// Brand tokens match the ThermoVolt Marine pitch deck.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0E2152', deep: '#081638' }, // headlines, dark fields
        royal: { DEFAULT: '#1B45C4', soft: '#E3EAFB' }, // primary, links, CTAs
        sky: { DEFAULT: '#3B9EF1', soft: '#DCEEFD' }, // logo sail, water, cooling
        slate: { DEFAULT: '#2E3A55', muted: '#55627A' }, // body copy
        mist: { DEFAULT: '#BDCDD3', deep: '#9FB4BE', light: '#D6E2EA' }, // brand grey-blue
        frost: '#F2F5F7',
        paper: '#FDFDFB',
        amber: { DEFAULT: '#F5B82E', bright: '#FFBC11', soft: '#FDF1D3' }, // electricity, bolt
        heat: { DEFAULT: '#E4572E', soft: '#FBE1D8' }, // hot side in diagrams only
      },
      fontFamily: {
        display: ['"Montserrat Variable"', 'Montserrat', 'Arial', 'sans-serif'],
        sans: ['Poppins', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { site: '1200px' },
      borderRadius: { card: '20px' },
      boxShadow: {
        lift: '0 1px 2px rgba(14,33,82,.06), 0 12px 32px -12px rgba(14,33,82,.18)',
      },
    },
  },
  plugins: [],
};
