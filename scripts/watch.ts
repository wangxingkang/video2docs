#!/usr/bin/node

import { createServer, build, createLogger } from 'vite';
import type { LogLevel, InlineConfig, ViteDevServer } from 'vite';
import { spawn } from 'child_process';
import type { ChildProcessWithoutNullStreams } from 'child_process';

const electronPath = require('electron');
const mode = process.env.MODE = process.env.MODE || 'development';

const LOG_LEVEL: LogLevel = 'warn';

const sharedConfig: InlineConfig = {
  mode,
  build: {
    watch: {},
  },
  logLevel: LOG_LEVEL,
};

const stderrFilterPatterns = [
  /ExtensionLoadWarning/,
];

interface GetWatcherOpts {
  name: string;
  configFile: string;
  writeBundle: () => void;
}

/**
 * 
 * @param param0 
 * @returns 
 */
const getWatcher = ({name, configFile, writeBundle}: GetWatcherOpts) => {
  return build({
    ...sharedConfig,
    configFile,
    plugins: [{name, writeBundle}],
  });
};

/**
 * 更改主线程源文件时启动或重新启动应用程序
 * @param viteDevServer 
 * @returns 
 */
const setupMainPackageWatcher = (
  viteDevServer: ViteDevServer
) => {
  {
    const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`;
    const host = viteDevServer.config.server.host || 'localhost';
    const port = viteDevServer.config.server.port;
    const path = '/';
    process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
  }

  const logger = createLogger(LOG_LEVEL, {
    prefix: '[main]',
  });

  let spawnProcess: ChildProcessWithoutNullStreams | null = null;

  return getWatcher({
    name: 'reload-app-on-main-package-change',
    configFile: 'packages/main/vite.config.js',
    writeBundle() {
      if (spawnProcess !== null) {
        spawnProcess.kill('SIGINT');
        spawnProcess = null;
      }

      spawnProcess = spawn(String(electronPath), ['.']);

      spawnProcess.stdout.on('data', d => d.toString().trim() && logger.warn(d.toString(), {timestamp: true}));
      spawnProcess.stderr.on('data', d => {
        const data = d.toString().trim();
        if (!data) return;
        const mayIgnore = stderrFilterPatterns.some((r) => r.test(data));
        if (mayIgnore) return;
        logger.error(data, { timestamp: true });
      });
    },
  });
};

/**
 * 
 * @param viteDevServer 
 * @returns 
 */
const setupPreloadPackageWatcher = (viteDevServer: ViteDevServer) => {
  return getWatcher({
    name: 'reload-page-on-preload-package-change',
    configFile: 'packages/preload/vite.config.js',
    writeBundle() {
      viteDevServer.ws.send({
        type: 'full-reload',
      });
    },
  });
};
console.log('123');

(async () => {
  try {
    console.log('123');
    const viteDevServer = await createServer({
      ...sharedConfig,
      configFile: 'packages/renderer/vite.config.js',
    });
  
    await viteDevServer.listen();
  
    await setupPreloadPackageWatcher(viteDevServer);
    await setupMainPackageWatcher(viteDevServer);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
