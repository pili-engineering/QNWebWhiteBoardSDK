import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import './styles/index.scss';

import { Router } from './router';

ReactDOM.render(
  <Router/>,
  document.getElementById('root')
);
