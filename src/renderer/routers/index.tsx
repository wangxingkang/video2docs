import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ROUTER_BASE_URL } from '@/config';
import { routes } from './config';
import { RouteProps } from './types';

export const RouteWithSubRoutes: React.FC<RouteProps> = (route) => {
  return (
    <Route
      path={route.path}
      render={(props) => {
        if (route.component) {
          return (
            <route.component {...props} />
          )
        }

        return null;
      }}
    />
  );
}

export const Routes: React.FC = () => {
  return (
    <BrowserRouter basename={ROUTER_BASE_URL}>
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  )
}
