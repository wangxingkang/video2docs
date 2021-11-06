#!/usr/bin/node

const { createServer, build, normalizePath } = require('vite');
const { join, relative } = require('path');

const mode = process.env.MODE || 'development';

function startElectron() {
  const { spawn } = require('child_process');

  const electronPath = require('electron');

  return spawn(electronPath, [join(process.cwd(), 'dist/source/main/index.cjs.js')]);
}


(async () => {
  // Create Vite dev server
  const server = await createServer({
    mode,
    configFile: join(process.cwd(), 'config/renderer.vite.ts'),
  });


  // Build preload entrypoint
  const buildPreload = () => build({mode, configFile: join(process.cwd(), 'config/preload.vite.ts')});
  await buildPreload();

  // Watch `src/preload` and rebuild preload entrypoint
  server.watcher.add(join(process.cwd(), 'src/preload/**'));
  server.watcher.on('change', (file) => {
    file = normalizePath(file);

    if (!file.includes('/src/preload/')) {
      return;
    }

    return buildPreload();
  });

  // Reload page on preload script change
  server.watcher.add(join(process.cwd(), 'dist/source/preload/**'));
  server.watcher.on('change', (file) => {
    file = normalizePath(file);

    if (!file.includes('/dist/source/preload/')) {
      return;
    }

    server.ws.send({
      type: 'full-reload',
      path: '/' + relative(server.config.root, file),
    });
  });

  // Run Vite server
  await server.listen();


  // Determining the current URL of the server. It depend on /config/renderer.vite.js
  // Write a value to an environment variable to pass it to the main process.
  {
    const protocol = `http${server.config.server.https ? 's' : ''}:`;
    const host = server.config.server.host || 'localhost';
    const port = server.config.server.port; // Vite searches for and occupies the first free port: 3000, 3001, 3002 and so on
    const path = '/';
    process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
  }

  // Build main entrypoint
  const buildMain = () => build({mode, configFile: join(process.cwd(), 'config/main.vite.ts')});
  await buildMain();

  // Watch `src/main` and rebuild main entrypoint
  server.watcher.add(join(process.cwd(), 'src/main/**'));
  server.watcher.on('change', (file) => {
    file = normalizePath(file);

    if (!file.includes('/src/main/')) {
      return;
    }

    return buildMain();
  });


  // Run electron app
  startElectron();
})();

