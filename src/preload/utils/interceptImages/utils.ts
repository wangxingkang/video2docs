import { join, parse } from 'path';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const ffmpeg = require('fluent-ffmpeg');

if (process.env.NODE_ENV !== 'development') {
  ffmpeg.setFfmpegPath(ffmpegPath.replace('app.asar', 'app.asar.unpacked'));
  ffmpeg.setFfprobePath(ffprobePath.replace('app.asar', 'app.asar.unpacked'));
} else {
  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);
}

/**
 * 获取视频时长
 * @param path 视频地址
 * @returns
 */
export function getDuration (path: string) {
  return new Promise<number>((resolve, reject) => {
    try {
      ffmpeg(path).ffprobe((_: unknown, data: any) => {
        if (data) {
          resolve(data.format.duration);
        } else {
          reject()
        }
      })
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 截取视频图片
 * @param path
 * @param interval
 */
export function getImages(filePath: string, opts: { interval: number, duration: number }) {
  return new Promise<string>((resolve, reject) => {
    const { interval, duration } = opts;
    const timestamps: number[] = [];
    const imgsDir = getImgsDir(filePath);

    let step = 0;

    while(step < duration) {
      timestamps.push(step);

      step = +(step + interval).toFixed(2);
    }

    if (timestamps[timestamps.length - 1] !== duration) {
      timestamps.push(duration);
    }

    ffmpeg(filePath)
      .on('end', function () {
        resolve(imgsDir);
      })
      .on('error', function () {
        reject()
      })
      .screenshots({
        timestamps,
        filename: '%s.png',
        folder: imgsDir,
        size: '880x600'
      });
  })
}

/**
 * 获取存放图片的目录
 * @param filePath
 * @returns
 */
export function getImgsDir(filePath: string) {
  const fileInfo = parse(filePath);

  return join(fileInfo.dir, `${fileInfo.name}_imgs`)
}
