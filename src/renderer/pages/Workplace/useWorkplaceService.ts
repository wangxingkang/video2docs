import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useElectron } from '@/hooks';
import { STORAGE_KEYS } from '@/config';

export function useWorkplaceService() {
  const [process, setProcess] = useState<boolean>(false);
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
      console.info(`开始处理: ${i+1}/${list.length} >> ${list[i]}`);
      await handleStart(list[i], interval);
    }
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
      // await electron.compressImages(imgsDir);

      // console.log(`压缩图片完成`);

      /** 3. 生成PPT */
      await electron.images2ppt(imgsDir);

      console.log(`PPT生成完成`);

      /** 4. 删除所有的图片 */
      electron.removeDir(imgsDir);
    }
  }

  const handleClickAll = () => {
    setProcess(true);

    handleStartAll()
      .then(() => {
        message.success('全部处理完成！');

        setTimeout(() => {
          setProcess(false);
        }, 200)
      })
      .catch(() => {
        message.error('处理失败！');

        setTimeout(() => {
          setProcess(false);
        }, 200)
      })
  }

  const handleReturn = () => {
    history.push('/home');
  }

  return {
    list,
    form,
    process,
    getFileInfo: electron.getFileInfo,
    handleStart,
    handleStartAll,
    handleReturn,
    handleClickAll,
  }
}
