import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from './store';
import 'antd/dist/antd.css';
import './styles/index.scss';
import './styles/style.scss';

ReactDOM.render(
  <Store>
    <App />
  </Store>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();