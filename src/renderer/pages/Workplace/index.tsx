import React from 'react';
import { Button } from 'antd';
import { BasicLayout } from '@/layouts';
import { useWorkplaceService } from './useWorkplaceService';

export default () => {
  const workplaceService = useWorkplaceService();


  return (
    <BasicLayout>
      login page

      <Button onClick={workplaceService.handleStart}>开始</Button>
    </BasicLayout>
  )
}
