import React from 'react';
import { Button, Input, Form, Space, Card, Empty, List } from 'antd';
import { BasicLayout } from '@/layouts';
import { useHomeService } from './useHomeService';
import styles from './index.module.less';

export default () => {
  const homeService = useHomeService();

  return (
    <BasicLayout>
      <div className={styles.main}>
        <div className={styles.content}>
          <Form form={homeService.form} layout="inline">
            <Form.Item>
              <Space>
                <Form.Item
                  name="dir"
                  noStyle
                >
                  <Input allowClear style={{ width: 380 }} placeholder="请输入需要处理的视频目录" />
                </Form.Item>
                <Button
                  onClick={homeService.handleSelectDir}
                >
                  选择目录
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Card
            style={{ marginTop: 16 }}
            title={`文件列表${homeService.list.length > 0 ? ('(' + homeService.list.length + ')') : ''}`}
            extra={
              <Space>
                <Button
                  type="primary"
                  size="small"
                  disabled={homeService.list.length > 0}
                  onClick={homeService.handleAnalyzeDir}
                >
                  解析目录
                </Button>
                <Button
                  danger
                  size="small"
                  disabled={homeService.list.length === 0}
                  onClick={homeService.handleClear}
                >
                  清空文件
                </Button>
                <Button
                  size="small"
                  disabled={homeService.list.length === 0}
                  onClick={homeService.handleNext}
                >
                  下一步
                </Button>
              </Space>
            }
            headStyle={{
              borderBottom: '1px dashed #f0f0f0'
            }}
          >
            {!homeService.list.length && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {!!homeService.list.length && (
              <List
                itemLayout="horizontal"
                dataSource={homeService.list}
                renderItem={item => {
                  const info = homeService.getFileInfo(item);

                  return (
                    <List.Item>
                      {info.name}
                    </List.Item>
                  )
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </BasicLayout>
  )
}
