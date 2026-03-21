import path from 'node:path';
import {defineConfig} from 'vite';

export default defineConfig(({mode}) => {
  const isProduction = mode === 'production';

  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, 'src/service-worker.ts'),
        fileName: () => 'service-worker.js',
        formats: ['iife'],
        name: 'backgroundSyncServiceWorker'
      },
      minify: isProduction ? 'esbuild' : false,
      outDir: path.resolve(__dirname, isProduction ? 'dist/app/browser' : 'src'),
      sourcemap: !isProduction,
      target: 'es2022'
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __SW_IS_PRODUCTION__: JSON.stringify(isProduction)
    }
  };
});
