import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 1234,
    proxy: {
      '/selfHostedHibpCheck': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
