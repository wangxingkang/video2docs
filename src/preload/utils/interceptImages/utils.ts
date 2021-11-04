const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * 获取视频时长
 * @param path 视频地址
 * @returns
 */
export function getDuration (path: string) {
  return new Promise<number>((resolve, reject) => {
    // @ts-ignore
    ffmpeg(path).ffprobe((_, data) => {
      if (data) {
        resolve(data.format.duration);
      } else {
        reject()
      }
    })
  });
}

/**
 *
 * @param path
 * @param interval
 */
export function getImages(path: string, opts: { interval: number, duration: number }) {
  return new Promise<boolean>((resolve, reject) => {
    const { interval, duration } = opts;
    const timestamps: number[] = [];

    let step = 0;

    while(step < duration) {
      timestamps.push(step);

      step = step + interval;
    }

    ffmpeg(path)
      .on('end', function () {
        resolve(true);
      })
      .on('error', function () {
        reject()
      })
      .screenshots({
        timestamps,
        filename: 'thumbnail-at-%s-seconds.png',
        folder: '/Users/aqian/Downloads/imgs',
        size: '880x600'
      });
  })
}
