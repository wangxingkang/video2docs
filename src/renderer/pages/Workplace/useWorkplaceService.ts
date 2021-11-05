import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useModal } from '@pansy/hooks';
import { Hook, Unhook } from 'console-feed';
import type { Message } from 'console-feed/lib/definitions/Component'
import { useHistory } from 'react-router-dom';
import { useElectron } from '@/hooks';
import { STORAGE_KEYS } from '@/config';

export function useWorkplaceService() {
  const [logs, setLogs] = useState<Message[]>([]);
  const [list, setList] = useState<string[]>([]);
  const history = useHistory();
  const electron = useElectron();
  const [form] = Form.useForm();
  const consoleModal = useModal();

  useEffect(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.files);

      if (data) {
        setList(JSON.parse(data));
      }
    },
    []
  );

  useEffect(
    () => {
      Hook(
        window.console,
        (log) => setLogs((currLogs) => [...currLogs, log] as any),
        false
      )
      return () => {
        Unhook(window.console as any)
      }
    },
  []
  )

  const handleStartAll = async () => {
    consoleModal.openModal();
    const interval = form.getFieldValue('interval');

    if (typeof interval !== 'number' || !interval) {
      return;
    }

    for (let i = 0; i < list.length; i++) {
      console.info(`开始处理: ${i+1}/${list.length} >> ${list[i]}`);
      await handleStart(list[i], interval);
    }

    consoleModal.closeModal();

    message.success('全部处理完成！');
  }

  const handleStart = async (filePath: string, interval: number) => {
    /** 1. 截图 */
    const interceptResult = await electron.interceptImages(filePath, {
      interval
    });

    console.log(`截取图片完成`);

    if (interceptResult.status === 'success' && interceptResult.data) {
      const imgsDir = interceptResult.data;
      /** 2. 压缩图片 */
      await electron.compressImages(imgsDir);

      console.log(`压缩图片完成`);

      /** 3. 生成PPT */
      await electron.images2ppt(imgsDir);

      console.log(`PPT生成完成`);

      /** 4. 删除所有的图片 */
      electron.removeDir(imgsDir);
    }
  }

  const handleReturn = () => {
    history.push('/home');
  }

  return {
    list,
    form,
    logs,
    consoleModal,
    getFileInfo: electron.getFileInfo,
    handleStart,
    handleStartAll,
    handleReturn,
  }
}
