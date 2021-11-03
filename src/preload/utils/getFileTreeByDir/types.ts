export type Status = 'success' | 'error';

export interface FileData {
  /**
   * 文件或文件夹的路径
   */
  path: string;
  /**
   * 文件或文件夹的名字
   */
  name: string;
  /**
   * 是否为文件夹
   */
  isDir: boolean;
  /**
   * 子级数据
   */
  children?: FileData[];
}

export interface Result {
  /**
   * 解析的状态
   */
  status: Status;
  /**
   * 错误的消息
   */
  message: string;
  /**
   * 解析后的数据
   */
  data?: FileData;
}
