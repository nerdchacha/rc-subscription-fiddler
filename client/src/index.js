import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { monkeyPathFetch } from './fetch'

monkeyPathFetch()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);