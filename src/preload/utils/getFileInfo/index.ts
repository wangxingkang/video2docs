import { basename } from 'path';

export function getFileInfo(path: string) {
  return {
    path,
    name: basename(path),
  }
}
