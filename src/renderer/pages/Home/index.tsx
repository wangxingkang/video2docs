import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      home page

      <Link to="/login">跳转登录</Link>
    </div>
  )
}
