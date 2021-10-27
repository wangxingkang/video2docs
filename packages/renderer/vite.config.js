import { join } from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh'
import { builtinModules } from 'module';
import { chrome } from '../../electron-vendors.config.json';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [
    reactRefresh()
  ],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: [
        ...builtinModules,
      ],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
}

export default config;
