import { useEffect, useState, useRef } from 'react';
import { Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useElectron } from '@/hooks';
import { STORAGE_KEYS } from '@/config';
import { pHash, hammingDistance } from './utils';

export function useWorkplaceService() {
  const params = useRef<Record<string, any>>({});
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
    const values = form.getFieldsValue();

    if (
      typeof values?.interval === 'number' &&
      values.interval > 0
    ) {
      params.current = values;

      for (let i = 0; i < list.length; i++) {
        console.info(`开始处理: ${i+1}/${list.length} >> ${list[i]}`);
        await handleStart(list[i]);
      }
    }
  }

  const handleStart = async (filePath: string) => {
    /** 1. 截图 */
    const interceptResult = await electron.interceptImages(filePath, {
      interval: params.current.interval,
    });

    console.log(`截取图片完成`);

    if (interceptResult.status === 'success' && interceptResult.data) {
      const imgsDir = interceptResult.data;

      /** 2. 图片去重 */
      if (params.current.unique) {
        const imgPaths = electron.getImgsPathByDir(imgsDir);
        const repeatImgs = await getRepeatImgs(imgPaths);
        repeatImgs.forEach((item) => {
          electron.removeFile(item);
        });

        console.log(`图片去重完成`);
      }

      /** 2. 压缩图片 */
      const compressResult = await electron.compressImages(imgsDir);

      if ((typeof compressResult?.status !== 'boolean') || !compressResult.status) {
        return;
      }

      /** 3. 压缩图片 */
      await electron.compressImages(imgsDir);

      console.log(`压缩图片完成`);

      /** 4. 生成PPT */
      await electron.images2ppt(imgsDir);

      console.log(`PPT生成完成`);

      /** 5. 删除所有的图片 */
      // electron.removeDir(imgsDir);
    }
  }

  /**
   * 获取重复的图片
   */
  const getRepeatImgs = async (imgPaths: string[]) => {
    const imgs: string[] = []

    const hashVals: string[] = [];

    for (let i = 0; i < imgPaths.length; i++) {
      const base64 = `data:image/png;base64,${electron.readFileSync(imgPaths[i], 'base64')}`;

      const hashVal = await pHash(base64);

      const isRepeat = hashVals.find(val => {
        return hammingDistance(val, hashVal) <= 1;
      });

      if (isRepeat) {
        imgs.push(imgPaths[i]);
      }
      hashVals.push(hashVal);
    }


    return imgs;
  };

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
