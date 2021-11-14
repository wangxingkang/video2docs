import { join, resolve, basename } from 'path';
import { getImgsPathByDir } from '../getImgsPathByDir';

const imagesPptx = require('@walrus/images-pptx');

export async function images2ppt(dir: string) {
  const minImagesDir = join(dir, 'min');
  const saveTo = resolve(dir, '../');
  const imgsPath = getImgsPathByDir(minImagesDir);

  await imagesPptx.createPptx({
    pictures: imgsPath,
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
