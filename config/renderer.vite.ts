import { join } from 'path';
import { defineConfig } from 'vite';
import vitePluginImp from "vite-plugin-imp";
import reactRefresh from '@vitejs/plugin-react-refresh';
import { chrome } from './electron-dep-versions';
import externalPkgs from './external-packages';

const ROOT_DIR = process.cwd();
const RENDERER_DIR = join(ROOT_DIR, './src/renderer');

export default defineConfig({
  base: './',
  root: RENDERER_DIR,
  resolve: {
    alias: {
      '@/': `${RENDERER_DIR}/`,
    },
  },
  optimizeDeps: {
    exclude: [
      'imagemin'
    ]
  },
  plugins: [
    reactRefresh(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => {
            if (name === "col" || name === "row") {
              return "antd/lib/style/index.less";
            }
            return `antd/es/${name}/style/index.less`;
          },
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    polyfillDynamicImport: false,
    base: '',
    outDir: join(ROOT_DIR, 'dist/source/renderer'),
    assetsDir: '.',
    rollupOptions: {
      external: externalPkgs,
    },
    emptyOutDir: true,
  },
});
