/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#E4E2DD',
        primary: '#1E1E1E',
        accent: '#3F66C2',
        'warm-orange': '#5C82E6',
        'soft-pink': '#FF89A9',
        'muted-text': '#444444',
      },
      fontFamily: {
        clash: ['Clash Display', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.1em',
        tighter: '-0.05em',
        wide: '0.1em',
        widest: '0.15em',
      },
      transitionTimingFunction: {
        'bezier': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
