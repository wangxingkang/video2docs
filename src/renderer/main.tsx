import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Routes } from '@/routers';
import './global.less';

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zh_CN}>
      <Routes />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
