import { join } from 'path';

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

export async function compressImages(dir: string) {
  const files = await imagemin([join(dir, '*.{jpg,png}')], {
    destination: join(dir, 'min'),
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });

  return files;
}
