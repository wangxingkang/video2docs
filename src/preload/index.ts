import { contextBridge, ipcRenderer } from 'electron';

const API_KEY = 'electron';

const api = {
  versions: process.versions,
  /**
   * 向主进程发送异步消息
   */
  callMain: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },
  /**
   * 获取主线程的响应
   * @param channel
   * @param callback
   */
  onResponse: (channel: string, callback?: (result: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => {
      callback?.(args);
    });
  }
} as const;

ipcRenderer.send


export type ExposedInMainWorld = Readonly<typeof api>;

contextBridge.exposeInMainWorld(API_KEY, api);
