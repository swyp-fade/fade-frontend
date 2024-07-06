/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        fullscreen: { raw: '(display-mode: fullscreen)' },
        touchdevice: { raw: '(pointer: coarse)' },
        pointerdevice: { raw: '(pointer: fine)' },
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
    },
  },
  plugins: [],
};
