import React from "react";

import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "material-ui";

import CloseIcon from '@material-ui/icons/Close';
import School from '@material-ui/icons/School';

import { RegularCard, ItemGrid, Button } from 'components';
import ReactTable from 'react-table';
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

class CurrentOrganization extends React.Component {

  _handleChange = field => event => {
    this.props.changeOrganization(field, event.target.value);
  };

  render() {

    const {
      organization,
      updateOrg,
      isSubmitting
    } = this.props;

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            headerColor="blue"
            cardTitle="Mi organización"
            cardSubtitle="En esta lista, encontrarás la información de tu organización."
            content={
              <form onSubmit={updateOrg()}>
                <TextField
                  id="name"
                  label="Nombre"
                  name="name"
                  inputRef={ref => (this.name = ref)}
                  onChange={this._handleChange('name')}
                  value={organization.name}
                  fullWidth
                  margin="normal"
                />
                <br />
                <TextField
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  inputRef={ref => (this.phone = ref)}
                  onChange={this._handleChange('phone')}
                  value={organization.phone}
                  fullWidth
                  margin="normal"
                />
                <br />
                <TextField
                  id="email"
                  label="Email"
                  name="email"
                  inputRef={ref => (this.email = ref)}
                  onChange={this._handleChange('email')}
                  value={organization.email}
                  fullWidth
                  margin="normal"
                />
                <br />
                <br />
                <Button type="submit" disabled={isSubmitting} color="primary">
                  Actualizar
                </Button>
              </form>
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default CurrentOrganization;
