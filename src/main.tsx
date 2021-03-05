import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import WebFont from 'webfontloader';

import AppWithRouter from './routes';
import { INITIAL_FONTS } from './constants';

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

WebFont.load({
  google: {
    families: INITIAL_FONTS,
  },
  loading() {
    root!.innerText = 'Please wait while all the fonts are loaded.';
  },
  active() {
    root!.innerText = '';
    render();
  }
});

