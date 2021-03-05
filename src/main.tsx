import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import AppWithRouter from './routes';

const root = document.getElementById('root');

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <AppWithRouter />
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
