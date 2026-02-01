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
        koma: '#f5deb3',
        ban: '#deb887',
        'ban-dark': '#c8a96e',
        tatami: '#c8b568',
        'tatami-light': '#e8d88c',
        warmgreen: '#8fbc8f',
        'warmgreen-light': '#b8d8b8',
      },
      fontFamily: {
        shogi: ['"Noto Serif JP"', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
