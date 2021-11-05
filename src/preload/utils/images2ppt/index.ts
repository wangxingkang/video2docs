import { readdirSync } from 'fs';
import { join, resolve, basename } from 'path';

const ImagesPptx = require('images-pptx')

export async function images2ppt(dir: string) {
  const minImagesDir = join(dir, 'min');

  const saveTo = resolve(dir, '../');

  const imgsPaths = readdirSync(minImagesDir).sort((a, b) => {
    return +(a.split('.')[0]) - +(b.split('.')[0])
  }).map((fileName) => join(minImagesDir, fileName))

  await ImagesPptx.createPptx({
    pictures: imgsPaths,
    saveTo,
    extension: 'png',
    pptxFileName: `${basename(dir).split('_')[0]}.pptx`
  })
}
