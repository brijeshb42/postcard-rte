import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from './App';

export default function AppWithRouter() {
  return (
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/text/:id">
        <App />
      </Route>
    </Switch>
  );
}
