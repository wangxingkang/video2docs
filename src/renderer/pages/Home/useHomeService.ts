import { useState } from 'react';
import { Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useElectron } from '@/hooks';
import { videoFormats, STORAGE_KEYS } from '@/config';

export function useHomeService() {
  const [list, setList] = useState<string[]>([]);
  const [form] = Form.useForm();
  const electron = useElectron();
  const history = useHistory();

  /**
   * 选择目录
   */
  const handleSelectDir = () => {
    electron.callMain('dialog:open-directory', 'openDirectory');
    electron.onResponse('dialog:open-directory:selected', (data) => {
      if (data[0]) {
        if (!data[0].canceled) {
          form.setFieldsValue({
            dir: data[0].filePaths[0],
          })
        }
      }
    });
  }

  /**
   * 解析目录
   */
  const handleAnalyzeDir = async () => {
    const dir = form.getFieldValue('dir');

    if (typeof dir !== 'string' || !dir) {
      message.warning('目录不能为空！');
      return;
    }

    const isDirResult = electron.isDir(dir);

    console.log(isDirResult);

    if (!isDirResult) {
      message.warning('目录不存在，请检查！');
      return;
    }

    const fileTreeResult = await electron.getFileTreeByDir(dir, videoFormats);

    if (fileTreeResult.status === 'error') {
      message.warning(fileTreeResult.message);
      return;
    }

    if (!fileTreeResult.data) {
      return;
    }

    message.success('目录解析成功！')

    setList(fileTreeResult.data);
  }

  const handleNext = () => {
    localStorage.setItem(STORAGE_KEYS.files, JSON.stringify(list));

    history.push('/workplace')
  }

  return {
    form,
    electron,
    list,
    getFileInfo: electron.getFileInfo,
    handleNext,
    handleSelectDir,
    handleAnalyzeDir,
  }
}
