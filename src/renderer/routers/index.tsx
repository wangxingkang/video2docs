import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ROUTER_BASE_URL } from '@/config';

export const Routes: React.FC = () => {
  return (
    <Router basename={ROUTER_BASE_URL}>
      <Switch>

      </Switch>
    </Router>
  )
}
