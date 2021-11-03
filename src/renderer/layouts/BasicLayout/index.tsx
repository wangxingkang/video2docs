import React from 'react';
import { Layout } from 'antd';
import styles from './index.module.less';

const { Header, Content, Footer } = Layout;

export const BasicLayout: React.FC = ({
  children,
}) => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            倩宝转换
          </div>
        </div>
      </Header>
      <Content className={styles.content}>
        {children}
      </Content>
      <Footer className={styles.footer}>
        Open-source MIT Licensed | © 2021-present
      </Footer>
    </Layout>
  )
}
