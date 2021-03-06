import React from 'react';
import { Switch } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  General as GeneralView,
  Dashboard as DashboardView,
  UserList as UserListView,
  Account as AccountView,
  ForDev as ForDevView,
  NotFound as NotFoundView
} from './views';

const Routes = () => {

  return (
    <Switch>
      <RouteWithLayout
        component={GeneralView}
        exact
        layout={MainLayout}
        path="/general"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/children"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={ForDevView}
        exact
        layout={MainLayout}
        path="/for-dev"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      {/* <Redirect to="/not-found" /> */}
    </Switch>
  );
};

export default Routes;
