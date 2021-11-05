import React, { useRef } from 'react';
import { Console } from 'console-feed';
import { Form, Button, InputNumber, Space, Card, List, Modal } from 'antd';
import { BasicLayout } from '@/layouts';
import { useWorkplaceService } from './useWorkplaceService';
import styles from './index.module.less';

export default () => {
  const root = useRef<HTMLDivElement>(null);
  const workplaceService = useWorkplaceService();

  return (
    <BasicLayout>
      <div className={styles.main}>
        <div className={styles.content} ref={root}>
          <Form form={workplaceService.form} layout="inline">
            <Form.Item>
              <Space>
                <Form.Item
                  name="interval"
                  label="间隔时间(S)"
                  initialValue={1}
                >
                  <InputNumber min={0.5} style={{ width: 100 }} placeholder="请输入需要处理的视频目录" />
                </Form.Item>
              </Space>
            </Form.Item>
          </Form>
          <Card
            style={{ marginTop: 16 }}
            title={`文件列表${workplaceService.list.length > 0 ? ('(' + workplaceService.list.length + ')') : ''}`}
            extra={
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={workplaceService.handleStartAll}
                >
                  开始
                </Button>
                <Button
                  size="small"
                  onClick={workplaceService.handleReturn}
                >
                  返回
                </Button>
              </Space>
            }
            headStyle={{
              borderBottom: '1px dashed #f0f0f0'
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={workplaceService.list}
              renderItem={item => {
                const info = workplaceService.getFileInfo(item);

                return (
                  <List.Item>
                    {info.name}
                  </List.Item>
                )
              }}
            />
          </Card>
        </div>

        <Modal
          visible={workplaceService.consoleModal.visible}
          maskClosable={false}
          closable={false}
          footer={null}
          width={600}
          className={styles.modal}
          getContainer={root.current as HTMLElement}
          onCancel={workplaceService.consoleModal.closeModal}
        >
          <div className={styles.console}>
            <Console logs={workplaceService.logs} variant="dark" />
          </div>
        </Modal>
      </div>
    </BasicLayout>
  )
}
