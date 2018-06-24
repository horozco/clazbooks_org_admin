import React from "react";
import { Grid, TextField, Button } from "material-ui";
import { Snackbar, IconButton } from "material-ui";
import { RegularCard, ItemGrid, Table } from "components";

import { SessionConsumer } from "components/Session/SessionContext.jsx";

import CloseIcon from '@material-ui/icons/Close';

import client from "../../utils/client.js";
import URLS from "../../constants/urls.js";
import Logo from "../../components/OrganizationLogo/OrganizationLogo.jsx";

class Settings extends React.Component {
  state = {
    success: false,
    name: '',
    isSubmitting: false,
    notificationMessage: ''
  };

  _handleSubmit = (id, cb) => event => {
    event.preventDefault();
    this.setState({
      isSubmitting: true
    }, () => {
      const data = new FormData();
      if (this.name.value) {
        data.append("organization[name]", this.name.value);
      }
      if (this.logo.value) {
        data.append("organization[logo]", this.logo.files[0]);
      }
      if (this.name.value || this.logo.value) {
        client.put(`${URLS.ORGANIZATIONS}${id}`, data).then((response)=>{
          cb(response);
          this.setState({
            name: '',
            success: true,
            isSubmitting: false,
            notificationMessage: 'Se ha actualizado correctamente la organización.'
          })
        });
      }else{
        this.setState({
          success: true,
          isSubmitting: false,
          notificationMessage: 'No se han realizado cambios'
        })
      }
    })
  };

  _handleChange = name => event => {
    this.setState({
      name: event.target.value
    });
  };

  _handleNotificationClose = () => {
    this.setState({success: false})
  }

  render() {
    return (
      <SessionConsumer>
        {session => {
          const {
            organization_admin: { organization }
          } = session;
          const {isSubmitting, notificationMessage, name, success} = this.state;
          return (
            <Grid container>
              <ItemGrid xs={12} sm={12} md={12}>
                <RegularCard
                  cardTitle="Configuración"
                  content={
                    <div>
                      <Grid container>
                        <ItemGrid xs={12} sm={12} md={12}>
                          <form onSubmit={this._handleSubmit(organization.id, session.updateOrganization)}>
                            <label>Nombre Actual: <strong>{organization.name}</strong></label>
                            <div>
                              <label>Logo Actual: </label>
                              <Logo className='img-show'></Logo>
                            </div>
                            <TextField
                              id="name"
                              label="Escriba un nuevo nombre"
                              name="name"
                              inputRef={ref => (this.name = ref)}
                              onChange={this._handleChange()}
                              value={name}
                              fullWidth
                              margin="normal"
                            />
                            <br />
                            <br />
                            <label>Cambiar Logo</label>
                            <br />
                            <input
                              ref={el => (this.logo = el)}
                              accept="image/*"
                              id="raised-button-file"
                              multiple
                              type="file"
                            />
                            <br />
                            <br />
                            <Button type="submit" disabled={isSubmitting} color="primary">
                              Actualizar
                            </Button>
                          </form>
                        </ItemGrid>
                      </Grid>
                      <br />
                    </div>
                  }
                />
              </ItemGrid>
              <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                open={success}
                onClose={this._handleNotificationClose}
                message={<span>{notificationMessage}</span>}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={this._handleNotificationClose}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />
            </Grid>
          );
        }}
      </SessionConsumer>
    );
  }
}

export default Settings;
