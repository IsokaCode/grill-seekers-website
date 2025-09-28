import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-script',
      writeBundle() {
        // Copy script.js to dist folder
        copyFileSync(
          resolve(__dirname, 'script.js'),
          resolve(__dirname, 'dist/script.js')
        );
      }
    }
  ],
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
        contact: './contact.html',
        'privacy-policy': './privacy-policy.html'
      }
    }
  },
  base: './'
});
