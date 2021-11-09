import { join } from 'path';
import { imageminPngquant } from '../imagemin-pngquant';

const imagemin = require('imagemin');

export async function compressImages(dir: string) {
  return await imagemin([join(dir, '*.{jpg,png}')], {
    destination: join(dir, 'min'),
    plugins: [
      imageminPngquant({
        speed: 1,
        strip: true,
        quality: [0.6, 0.8],
        getPngquantPath: (path: string) => {
          console.log(path);
          if (process.env.NODE_ENV !== 'development') {
            return path.replace('app.asar', 'app.asar.unpacked');
          }
          return path
        }
      })
    ]
  })
  .then((file: any) => {
    return {
      status: true,
      data: file,
    };
  })
  .catch((e: Error) => {
    console.error(e);
    return {
      status: false,
      error: e.toString(),
    };
  });
}
