import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { RouterLoading } from '../components/router-loading';

const Home = lazy(() => import('../pages/home'));
const Room = lazy(() => import('../pages/room'));

export const Router: React.FC = () => {
  return <BrowserRouter>
    <Suspense fallback={<RouterLoading/>}>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/room" component={Room}/>
        <Redirect to="/"/>
      </Switch>
    </Suspense>
  </BrowserRouter>;
};
