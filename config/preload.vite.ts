import { join } from 'path';
import { defineConfig } from 'vite';
import { chrome } from './electron-dep-versions';
import externalPkgs from './external-packages';

const ROOT_DIR = process.cwd();
const PRELOAD_DIR = join(ROOT_DIR, './src/preload');

export default defineConfig({
  resolve: {
    alias: {
      '/@/': `${PRELOAD_DIR}/`,
    }
  },
  optimizeDeps: {
    exclude: [
      'imagemin'
    ]
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: join(ROOT_DIR, 'dist/source/preload'),
    assetsDir: '.',
    minify: process.env.MODE === 'development' ? false : 'terser',
    lib: {
      entry: 'src/preload/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: externalPkgs,
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
        assetFileNames: '[name].[ext]',
      },
    },
    emptyOutDir: true,
  },
});
