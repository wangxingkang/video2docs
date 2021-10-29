import type { ExposedInMainWorld } from '../../../preload';

export function useElectron(): ExposedInMainWorld {
  // @ts-ignore
  return window.electron as ExposedInMainWorld;
}
