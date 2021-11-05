import React from 'react';
import { Button } from 'antd';
import { BasicLayout } from '@/layouts';
import { useWorkplaceService } from './useWorkplaceService';

export default () => {
  const workplaceService = useWorkplaceService();


  return (
    <BasicLayout>
      <Button onClick={workplaceService.handleStart}>开始</Button>
      <Button onClick={workplaceService.handleReturn}>返回</Button>
    </BasicLayout>
  )
}
