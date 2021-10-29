import { contextBridge, ipcRenderer } from 'electron';

const API_KEY = 'electron';

const api = {
  versions: process.versions,
  ipcRenderer,
  /**
   * 获取主线程的相应
   * @param channel
   * @param callback
   */
  onResponse: (channel: string, callback?: (result: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => {
      callback?.(args);
    });
  }
} as const;


export type ExposedInMainWorld = Readonly<typeof api>;

contextBridge.exposeInMainWorld(API_KEY, api);
