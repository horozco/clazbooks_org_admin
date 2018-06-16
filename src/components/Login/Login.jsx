import React from "react";
import {
  Redirect
} from "react-router-dom";
import { SessionConsumer } from "components/Session/SessionContext.jsx";

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      debugger;
      return <Redirect to={from} />;
    }

    return (
      <SessionConsumer>
        {
          session => (
            <React.Fragment>
              <h1>Login</h1>
              <button onClick={() => {
                session.login().then((result) => {
                  this.setState({redirectToReferrer: true})
                })
              }}>
                Login
              </button>
            </React.Fragment>
          )
        }
      </SessionConsumer>
    );
  }
}

export default Login;
