import React, { useState } from 'react';
import { Button, Input, Form, Space } from 'antd';
import { useElectron } from '@/hooks';

export const SelectDirectory: React.FC = () => {
  const [form] = Form.useForm();

  const { callMain, onResponse } = useElectron();

  const handleClick = () => {
    callMain('dialog:open-directory', 'openDirectory');
    onResponse('dialog:selectedItem', (data) => {
      if (data[0]) {
        if (!data[0].canceled) {
          form.setFieldsValue({
            dir: data[0].filePaths[0],
          })
        }
      }
    });
  }

  return (
    <Form form={form}>
      <Form.Item>
        <Space>
          <Form.Item name="dir" noStyle>
            <Input style={{ width: 400 }} placeholder="请输入需要处理的视频目录" />
          </Form.Item>
          <Button
            onClick={handleClick}
          >
            点击选择
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
