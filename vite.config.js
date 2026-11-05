import { defineConfig } from 'vite';
import { resolve } from 'path';
import { seoPlugin } from './seo-plugin.js';

export default defineConfig({
  // relative base so the build works at any path (GitHub Pages subpath or Netlify root)
  base: './',
  plugins: [seoPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        order: resolve(__dirname, 'order.html'),
        about: resolve(__dirname, 'about.html'),
        reservation: resolve(__dirname, 'reservation.html'),
      },
    },
  },
});
