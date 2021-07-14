import React, { useEffect } from 'react';
import { Switch, BrowserRouter, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Room from './pages/room';

const Routes = () => {
  const location = useLocation();
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    if (location.pathname === '/room') {
      canvas.style.display = 'block';
    } else {
      canvas.style.display = 'none';
    }
  }, [location]);
  return <>
    <Route exact path='/' component={Home} />
    <Route path='/room' component={Room} />
  </>;
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Routes />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
