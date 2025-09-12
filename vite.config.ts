import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        menu: './menu.html',
        packages: './packages.html',
        gallery: './gallery.html',
        reviews: './reviews.html',
        'privacy-policy': './privacy-policy.html'
      }
    }
  },
  base: './'
});
