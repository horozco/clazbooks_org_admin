import React from "react";
import {
  Redirect
} from "react-router-dom";
import { SessionConsumer } from "components/Session/SessionContext.jsx";
import { withFormik, Formik } from 'formik';
import LoginForm from "./LoginForm.jsx"
import { TextField,
         Button,
         Snackbar,
         IconButton,
         Checkbox,
         FormControlLabel,
         AppBar,
         Toolbar,
         Typography } from 'material-ui';
import { Close,
         PhoneIphone,
         Android } from '@material-ui/icons';
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

  componentDidMount() {
    document.body.setAttribute("style", "background-color: #FFFFFF");
  };

  render() {
    const { from } = { from: { pathname: "/dashboard" } };
    const { redirectToReferrer, email, password, rememberMe, showError, errors } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <React.Fragment>
        <div className='nav-root'>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="title" color="inherit" className='nav-text'>
                Descarga Clazbooks
              </Typography>
              <IconButton href='https://itunes.apple.com/us/app/clazbooks/id1224261279?ls=1&mt=8' target='_blank' className='nav-button' color="inherit" aria-label="Ios">
                <PhoneIphone />
              </IconButton>
              <IconButton href='https://play.google.com/store/apps/details?id=com.clazbooks.clazbooks' target='_blank' className='nav-button' color="inherit" aria-label="Android">
                <Android />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
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
                          <Button variant="raised" color="primary" type="submit" disabled={isSubmitting}>
                            Iniciar Sesión
                          </Button>
                        </div>
                      </form>
                      <a href='https://clazbooks.com' target='_blank'>
                        <img className="img" src={logo} />
                      </a>
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
                      <Close />
                    </IconButton>,
                  ]}
                />
              </div>
            )
          }
        </SessionConsumer>
      </React.Fragment>
    );
  }
}

export default Login;
