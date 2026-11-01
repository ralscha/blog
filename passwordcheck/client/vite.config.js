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
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
