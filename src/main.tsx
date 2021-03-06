import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AppWithRouter from './routes';

import 'react-toastify/dist/ReactToastify.css';

const root = document.getElementById('root');

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <AppWithRouter />
      </Router>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        autoClose={3000}
        closeOnClick
      />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
