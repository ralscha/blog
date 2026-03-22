import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    proxy: {
      '/poll': 'http://localhost:8080',
      '/register': 'http://localhost:8080'
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});