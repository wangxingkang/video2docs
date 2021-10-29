import { RouteProps as ReactRouteProps } from 'react-router-dom';

export interface RouteProps extends ReactRouteProps {
  path: string;
  /**
   * 重定向地址
   */
  redirect?: string;
  /**
   * 子路由
   */
  routes?: RouteProps[];
}
