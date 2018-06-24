import React from "react";
import { TextField, Button } from 'material-ui';
import "./login.css"

const LoginForm = props => {
  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;
  return (
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

      <Button type="submit" disabled={isSubmitting} color="primary">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
