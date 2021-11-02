import { readdirSync } from 'fs';

export function readDir(path: string) {
  const files = readdirSync(path);

  console.log(files);
}
