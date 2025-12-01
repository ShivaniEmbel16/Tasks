/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'inner-strong': 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      colors: {
        midnight: {
          900: '#050017',
          800: '#0C0922',
          700: '#131232',
        },
      },
    },
  },
  plugins: [],
}
