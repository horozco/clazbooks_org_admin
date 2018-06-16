import React from 'react';
import {Route, Redirect } from 'react-router-dom';
import { SessionConsumer } from "components/Session/SessionContext.jsx";

const AuthRoute = ({ component: Component, ...rest }) => (
  <SessionConsumer>
    {
      session => (
        <Route
          {...rest}
          render={props =>
            session.isLoggedIn ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location }
                }}
              />
            )
          }
        />
      )
    }
  </SessionConsumer>
);

export default AuthRoute;
