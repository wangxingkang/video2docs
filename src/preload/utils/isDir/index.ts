import { lstatSync } from 'fs';

/**
 * 判断是否为目录
 * @param name
 */
export function isDir(path: string): boolean {
  let result;

  try {
    result = lstatSync(path).isDirectory();
  } catch (err) {
    result =  false;
  }

  return result;
}
