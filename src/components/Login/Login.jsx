import React from "react";
import {
  Redirect
} from "react-router-dom";
import { SessionConsumer } from "components/Session/SessionContext.jsx";
import { withFormik, Formik } from 'formik';
import LoginForm from "./LoginForm.jsx"
import { TextField, Button, Snackbar, IconButton, Checkbox, FormControlLabel } from 'material-ui';
import CloseIcon from '@material-ui/icons/Close';
import logo from "assets/img/logo.png";
import "./login.css"

class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    email: '',
    password: '',
    rememberMe: false,
    showError: false,
    errors: {}
  };

  _handleErrorMessageClose = () => {
    this.setState({showError: false, errors: {}})
  };

  render() {
    const { from } = { from: { pathname: "/dashboard" } };
    const { redirectToReferrer, email, password, rememberMe, showError, errors } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <SessionConsumer>
        {
          session => (
            <div className="wrapper">
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                onSubmit={(
                  values,
                  { setSubmitting, setErrors}
                ) => {
                  setSubmitting(true);
                  session.login(values).then((result) => {
                    this.setState({redirectToReferrer: true})
                    setSubmitting(false);
                  },
                  errors => {
                    setSubmitting(false);
                    this.setState({errors: errors, showError: true})
                  });
                }}
                render={({
                  values,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <React.Fragment>
                    <form className="login-form" onSubmit={handleSubmit}>
                      <div className="field-wrapper">
                        <TextField
                          id="email"
                          label="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          fullWidth
                          margin="normal"
                        />
                      </div>
                      <div className="field-wrapper">
                        <TextField
                          id="password"
                          label="Contraseña"
                          name="password"
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                          required
                          margin="normal"
                        />
                      </div>
                      <div className="field-wrapper">
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="rememberMe"
                              checked={values.rememberMe}
                              onChange={handleChange}
                              value="true"
                            />
                          }
                          label="Recordarme"
                        />
                      </div> 

                      <div className="field-wrapper">
                        <Button type="submit" disabled={isSubmitting} color="primary">
                          Iniciar Sesión
                        </Button>
                      </div>
                    </form>
                    <div>
                      <img className="img" src={logo} />
                    </div>
                  </React.Fragment>
                )}
              />
              <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                open={showError}
                onClose={this._handleErrorMessageClose}
                message={<span>{this.state.errors.message}</span>}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={this._handleErrorMessageClose}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />
            </div>
          )
        }
      </SessionConsumer>
    );
  }
}

export default Login;
