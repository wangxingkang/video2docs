import Home from '@/pages/Home';
import Workplace from '@/pages/Workplace';

import { RouteProps } from './types';

export const routes: RouteProps[] = [
  {
    path: '/workplace',
    component: Workplace
  },
  {
    path: '/',
    component: Home
  },
];
