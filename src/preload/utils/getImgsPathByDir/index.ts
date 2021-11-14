import { readdirSync } from 'fs';
import { join } from 'path';

export function getImgsPathByDir(dir: string) {
  return readdirSync(dir)
    .sort((a, b) => {
      return +(a.split('.')[0]) - +(b.split('.')[0])
    })
    .map((fileName) => join(dir, fileName));
}
