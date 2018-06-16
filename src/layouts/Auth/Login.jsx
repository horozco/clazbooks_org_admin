import React from "react";
import Login from "components/Login/Login.jsx";

class LoginLayout extends React.Component {
  render() {
    return <Login {...this.props} />
  }
};

export default LoginLayout;
