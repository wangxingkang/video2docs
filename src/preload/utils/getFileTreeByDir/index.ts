import { readdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { isDir } from '../';
import { Result } from './types';

/**
 * 解析目录的文件
 * @param dir
 * @param formats
 * @returns
 */
export async function getFileTreeByDir(
  rootDir: string,
  formats: string[],
) {
  const result = {
    status: 'success',
  } as Result;

  const isDirResult = isDir(rootDir);

  if (!isDirResult) {
    result.status = 'error';
    result.message = '目录不存在！';

    return result;
  }

  const files = (readdirSync(rootDir) ?? []).map(item => {
    return join(rootDir, item)
  });

  if (files.length === 0) {
    result.status = 'error';
    result.message = '目录为空！';

    return result;
  }

  const list: string[] = [];

  function getChildrenFiles(files: string[]) {
    files.forEach(item => {
      if (isDir(item)) {
        const nextFiles = (readdirSync(item) ?? []).map((path) => {
          return join(item, path)
        });

        if (nextFiles.length) {

          getChildrenFiles(nextFiles);
        }
      }

      const isVideoFileResult = isVideoFile(item, formats);

      if (isVideoFileResult) {
        list.push(item);
      }
    });
  }

  getChildrenFiles(files);

  result.data = list;

  return result;
}

export function isVideoFile(
  path: string,
  formats: string[],
) {
  return formats.includes(extname(path));
}
