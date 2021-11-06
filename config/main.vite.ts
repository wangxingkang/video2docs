import { join } from 'path';
import { defineConfig } from 'vite';
import { node } from './electron-dep-versions';
import externalPkgs from './external-packages';

const ROOT_DIR = process.cwd();
const MAIN_DIR = join(ROOT_DIR, './src/main');

export default defineConfig({
  resolve: {
    alias: {
      '/@/': `${MAIN_DIR}/`,
    },
  },
  optimizeDeps: {
    exclude: [
      'imagemin'
    ]
  },
  build: {
    sourcemap: true,
    target: `node${node}`,
    outDir: join(ROOT_DIR, 'dist/source/main'),
    assetsDir: '.',
    minify: process.env.MODE === 'development' ? false : 'terser',
    lib: {
      entry: 'src/main/index.ts',
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
