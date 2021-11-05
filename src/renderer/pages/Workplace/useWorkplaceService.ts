import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useElectron } from '@/hooks';
import { STORAGE_KEYS } from '@/config';

export function useWorkplaceService() {
  const [list, setList] = useState<string[]>([]);
  const history = useHistory();
  const electron = useElectron();
  const [form] = Form.useForm();

  useEffect(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.files);

      if (data) {
        setList(JSON.parse(data));
      }
    },
    []
  );

  const handleStartAll = async () => {
    const interval = form.getFieldValue('interval');

    if (typeof interval !== 'number' || !interval) {
      return;
    }

    for (let i = 0; i < list.length; i++) {
      await handleStart(list[i], interval);
    }
  }

  const handleStart = async (filePath: string, interval: number) => {
    /** 1. 截图 */
    const interceptResult = await electron.interceptImages(filePath, {
      interval
    });

    if (interceptResult.status === 'success' && interceptResult.data) {
      const imgsDir = interceptResult.data;
      /** 2. 压缩图片 */
      await electron.compressImages(imgsDir);

      /** 3. 生成PPT */
      await electron.images2ppt(imgsDir)
    }
  }

  const handleReturn = () => {
    history.push('/home');
  }

  return {
    list,
    form,
    getFileInfo: electron.getFileInfo,
    handleStart,
    handleStartAll,
    handleReturn,
  }
}
