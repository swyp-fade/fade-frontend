import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('lottie')) {
            return '@lottie-vendor';
          }
          if (id.includes('axios') || id.includes('date-fns') || id.includes('framer-motion')) {
            return '@lib-vendor';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return '@react-vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: '@Components', replacement: '/src/components' },
      { find: '@Hooks', replacement: '/src/hooks' },
      { find: '@Layouts', replacement: '/src/layouts' },
      { find: '@Libs', replacement: '/src/libs' },
      { find: '@Pages', replacement: '/src/pages' },
      { find: '@Routes', replacement: '/src/routes' },
      { find: '@Services', replacement: '/src/services' },
      { find: '@Stores', replacement: '/src/stores' },
      { find: '@Types', replacement: '/src/types' },
      { find: '@Utils', replacement: '/src/utils' },
      { find: '@', replacement: '/src' },
    ],
  },
});
