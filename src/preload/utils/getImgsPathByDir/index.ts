import { readdirSync } from 'fs';
import { join } from 'path';

export function getImgsPathByDir(dir: string) {
  return readdirSync(dir)
    .sort((a, b) => {
      return +getImageTime(a) - +getImageTime(b)
    })
    .map((fileName) => join(dir, fileName));
}

export function getImageTime(pathStr: string) {
  const list = pathStr.split('.');

  list.pop();

  return list.join('.');
}
