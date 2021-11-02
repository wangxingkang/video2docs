import React from 'react';
import { Layout } from 'antd';
import styles from './index.module.less';

const { Header, Content } = Layout;

const logo = new URL('../../assets/logo.svg', import.meta.url).href

export const BasicLayout: React.FC = ({
  children,
}) => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.navbar}>
          <img src={logo} />
        </div>
      </Header>
      <Content className={styles.content}>
        {children}
      </Content>
    </Layout>
  )
}
