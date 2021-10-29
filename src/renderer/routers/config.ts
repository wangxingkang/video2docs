import Home from '@/pages/Home';
import Login from '@/pages/Login';

import { RouteProps } from './types';

export const routes: RouteProps[] = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home
  },
];
