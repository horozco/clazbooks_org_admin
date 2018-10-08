import React, { Component } from "react";
import {
  login,
  clearSession,
  loggedIn,
  getSession,
  setOrganization,
  managedOrganizations,
  isSuperAdmin
} from '../../utils/session.js';

const { Provider, Consumer } = React.createContext();

export class SessionProvider extends Component {
  _handleLogin = (params) => {
    return login(params).then( ({data}) => {
      this.setState({
        ...data,
        isLoggedIn: true,
        isSuperAdmin: isSuperAdmin(),
        managedOrganizations: managedOrganizations(),
      })
    });
  };

  _signout = () => {
    return Promise.resolve().then(response => {
      clearSession();
      this.setState({
        isLoggedIn: false,
        isSuperAdmin: false,
        managedOrganizations: [],
      });
    });
  };

  _updateOrganization = ({data: {organization}}) => {
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
