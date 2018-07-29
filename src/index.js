import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import AuthRoute from 'components/Auth/AuthRoute.jsx';
import Login from 'components/Login/Login.jsx';
import { SessionProvider } from 'components/Session/SessionContext.jsx';
import { loggedIn } from './utils/session.js';

import 'assets/css/material-dashboard-react.css?v=1.2.0';
import 'react-table/react-table.css'

import indexRoutes from 'routes/index.jsx';

const hist = createBrowserHistory();

// fetchCurrentOrganization();

ReactDOM.render(
  <SessionProvider>
    <Router history={hist}>
      <Switch>
        <Route
          path="/login"
          render={props =>
            loggedIn() ? (
              <Redirect
                to={{
                  pathname: '/dashboard',
                  state: { from: props.location },
                }}
              />
            ) : (
              <Login />
            )
          }
        />
        {indexRoutes.map((prop, key) => {
          return (
            <AuthRoute path={prop.path} component={prop.component} key={key} />
          );
        })}
      </Switch>
    </Router>
  </SessionProvider>,
  document.getElementById('root')
);
