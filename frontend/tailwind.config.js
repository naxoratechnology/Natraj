export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#062866', 900: '#03163B', 800: '#041E50', 700: '#0A357D', 600: '#10489B' },
        brand: { DEFAULT: '#087DFF', 50: '#EFF8FF', 100: '#DDF0FF', 200: '#B9E0FF', 600: '#066DE2', 700: '#075ABD' },
        cyan: { DEFAULT: '#05B8F2', 50: '#ECFBFF', 100: '#CFF5FF', 600: '#0098D4' },
        teal: { DEFAULT: '#FF8A00', 50: '#FFF7E8', 100: '#FFE8BC', 700: '#BC5B00' },
        canvas: '#F4F8FD',
        surface: '#FFFFFF',
        ink: '#102650',
        muted: '#63738D',
        line: '#DFE8F3',
        success: { DEFAULT: '#16845B', 50: '#E7F4EE', 700: '#0F6646' },
        warning: { DEFAULT: '#F5A000', 50: '#FFF7E5', 700: '#A75C00' },
        danger: { DEFAULT: '#C2414B', 50: '#FBECEE', 700: '#A2333C' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(8,43,102,0.03), 0 8px 28px -18px rgba(8,43,102,0.22)',
        pop: '0 24px 60px -18px rgba(8,43,102,0.28), 0 4px 14px rgba(8,43,102,0.06)',
        frame: '0 38px 90px -32px rgba(8,43,102,0.38), 0 12px 30px -14px rgba(8,43,102,0.16)',
      },
    },
  },
};
