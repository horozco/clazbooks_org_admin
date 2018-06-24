import React, { Component } from "react";
import { login, clearSession, loggedIn, getSession, setOrganization } from '../../utils/session.js';

const { Provider, Consumer } = React.createContext();

export class SessionProvider extends Component {
  _handleLogin = (params) => {
    return login(params).then( ({data}) => {
      this.setState({
        ...data,
        isLoggedIn: true
      })
    });
  };

  _signout = () => {
    return Promise.resolve().then(response => {
      clearSession();
      this.setState({
        isLoggedIn: false,
      });
    });
  };

  _updateOrganization = ({data: {organization}}) => {
    debugger;
    this.setState({
      organization_admin: {organization: organization}
    }, () => {setOrganization(organization)})
  }

  state = {
    isLoggedIn: loggedIn(),
    login: this._handleLogin,
    signout: this._signout,
    updateOrganization: this._updateOrganization,
    ...getSession()
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const SessionConsumer = Consumer;
