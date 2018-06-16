import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import AuthRoute from "components/Auth/AuthRoute.jsx";
import Login from "components/Login/Login.jsx";
import { SessionProvider } from "components/Session/SessionContext.jsx";

import "assets/css/material-dashboard-react.css?v=1.2.0";

import indexRoutes from "routes/index.jsx";

const hist = createBrowserHistory();

ReactDOM.render(
  <SessionProvider>
    <Router history={hist}>
      <Switch>
        <Route path="/login" component={Login} />
        {indexRoutes.map((prop, key) => {
          return <AuthRoute path={prop.path} component={prop.component} key={key} />;
        })}
      </Switch>
    </Router>
  </SessionProvider>,
  document.getElementById("root")
);
