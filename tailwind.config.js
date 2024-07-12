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
      boxShadow: {
        bento: '0 .125rem .25rem .0625rem rgba(0,0,0,.1)',
      },
    },
  },
  plugins: [],
};
