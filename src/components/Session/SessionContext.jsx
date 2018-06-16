import React from "react";

export const session = {
  organization: {
    name: "Este es el nombre",
    logo: "https://www.seoclerk.com/pics/558390-11FO8A1505384509.png"
  },
  token: "bashasldajej3d",
  isLoggedIn: true
};

const { Provider, Consumer } = React.createContext();

export class SessionProvider extends React.Component {
  login = () => {
    return Promise.resolve(session).then(response => {
      this.setState({
        ...response
      });
    });
  };

  signout = () => {
    return Promise.resolve().then(response => {
      this.setState({
        organization: {},
        token: {},
        isLoggedIn: false,
      });
    });
  };

  state = {
    organization: {},
    token: {},
    isLoggedIn: false,
    login: this.login,
    signout: this.signout
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const SessionConsumer = Consumer;
