import { useState } from 'react';
import { Form, message } from 'antd';
import { useElectron } from '@/hooks';

export function useHomeService() {
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();
  const electron = useElectron();

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

    const isDirResult = await electron.isDir(dir);

    if (!isDirResult) {
      message.warning('目录不存在，请检查！');
    }

    electron.readDir(dir);
  }

  return {
    form,
    electron,
    treeData,
    handleSelectDir,
    handleAnalyzeDir,
  }
}
