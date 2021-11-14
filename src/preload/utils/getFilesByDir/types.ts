export type Status = 'success' | 'error';

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
  data?: string[];
}
