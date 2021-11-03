import { readdirSync } from 'fs';
import { isDir } from '../';
import { Result } from './types';

/**
 * 解析目录的文件
 * @param dir
 * @param formats
 * @returns
 */
export async function getFileTreeByDir(
  dir: string,
  formats: string[],
) {
  const result = {
    status: 'success',
  } as Result;

  const isDirResult = isDir(dir);

  if (!isDirResult) {
    result.status = 'error';
    result.message = '目录不存在！';

    return result;
  }

  const files = readdirSync(dir) ?? [];

  if (files.length === 0) {
    result.status = 'error';
    result.message = '目录为空！';

    return result;
  }


  console.log(files);

  return result;
}
