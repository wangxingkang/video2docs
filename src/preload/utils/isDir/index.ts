import { promises as fs } from 'fs';

const stat = fs.stat;

/**
 * 判断是否为目录
 * @param name
 */
export function isDir(name: string): Promise<boolean> {
  return stat(name)
    .then(stats => stats.isDirectory())
		.catch(() => false);
}
