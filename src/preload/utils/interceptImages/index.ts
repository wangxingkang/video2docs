import { getDuration, getImages } from './utils';

interface Options {
  /**
   * 间隔的时间，以秒为单位
   * @default 1
   */
  interval?: number;
}

interface Result {
  status: 'success' | 'error';
  message: string;
}

/**
 * 按照一定时间间隔截取视频中的图片
 * @param path
 */
export async function interceptImages(path: string, opts: Options = {}) {
  const { interval = 1 } = opts;

  const result = {} as Result;

  const duration = await getDuration(path);

  if (duration < interval) {
    result.status = 'error';
    result.message = '时间间隔大于视频长度';
    return result;
  }

  const isSuccess = await getImages(path, {
    duration,
    interval,
  });

  if (isSuccess) {
    result.status = 'success';
  } else {
    result.status = 'error';
    result.message = '生成图片失败';
  }

  return result;
}
