import type { ExposedInMainWorld } from '../../../preload';

export function useElectron(): ExposedInMainWorld {
  return window.electron as ExposedInMainWorld;
}
