import { readdirSync } from 'fs';
import { join, resolve, basename } from 'path';

const imagesPptx = require('@walrus/images-pptx');

export async function images2ppt(dir: string) {
  // const minImagesDir = join(dir, 'min');

  const minImagesDir = join(dir);

  const saveTo = resolve(dir, '../');

  const imgsPaths = readdirSync(minImagesDir).sort((a, b) => {
    return +(a.split('.')[0]) - +(b.split('.')[0])
  }).map((fileName) => join(minImagesDir, fileName));

  await imagesPptx.createPptx({
    pictures: imgsPaths,
    saveTo,
    extension: 'png',
    pptxFileName: `${basename(dir).split('_')[0]}.pptx`,
    getSharedDir: (dir: string) => {
      if (process.env.NODE_ENV !== 'development') {
        return dir.replace('app.asar', 'app.asar.unpacked');
      }
      return dir
    }
  })
}
