/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15171B',
        steel: '#4A5160',
        mist: '#F3F3F1',
        line: '#E3E3E0',
        signal: '#FF5A1F',
        signalDark: '#E14A12',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'hazard-stripe':
          'repeating-linear-gradient(135deg, #FF5A1F 0, #FF5A1F 10px, #15171B 10px, #15171B 20px)',
      },
    },
  },
  plugins: [],
};
