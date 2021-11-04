import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useElectron } from '@/hooks';
import { videoFormats, STORAGE_KEYS } from '@/config';

export function useWorkplaceService() {
  const [list, setList] = useState<string[]>([]);

  const electron = useElectron();

  useEffect(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.files);

      if (data) {
        setList(JSON.parse(data));
      }
    },
    []
  );

  const handleStart = async () => {
    const result = await electron.interceptImages(list[0], {
      interval: 2
    });

    console.log(result);
  }

  return {
    list,
    handleStart,
  }

}
