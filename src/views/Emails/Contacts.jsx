import React from "react";
import { Link } from 'react-router-dom';

import {
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "material-ui";

import client from '../../utils/client';
import URLS from '../../constants/urls.js';

import {
  Delete,
  PersonAdd,
  Cancel
} from "@material-ui/icons";

import { RegularCard, ItemGrid, Button } from 'components';
import ReactTable from 'react-table';

class Contacts extends React.Component {
  state = {
    emails: '',
    isSubmitting: false,
    openAddContactModal: false,
    users: this.props.users || [],
    contacts: this.props.contacts || [],
    csv: false,
  };

  _updateContacts = (data) => {
    this.setState({
      contacts: data.contacts
    });
  };

  _handleAddContact = (evt) => {
    evt.preventDefault();
    var message = undefined;
    this.setState({
      isSubmitting: true
    }, () => {
      const data = new FormData();
      if (this.state.emails) {
        data.append("contact[emails]", this.state.emails);
      }
      if (this.file.value) {
        data.append("contact[file]", this.file.files[0]);
      }
      client
        .post(`${URLS.CONTACTS}`, data)
          .then(({ data }) => {
            if (data.errors && data.errors.length >= 1) {
              message = data.errors
                .map(error => {
                  return error.email[0];
                })
                .join('-');
            }

            this.props.setMessage(message || 'Se han creado ' + data.contacts.length + ' contactos.')
            this.setState({
              openAddContactModal: false,
              emails: '',
              contacts: this.props.contacts
            });
            this.props.getAllContacts(this._updateContacts);
          })
          .catch(error => {
            this.props.setMessage('Ha ocurrido un error: ' + error.message);
          });
      }
    )
  };

  _handleClickAddContact = () => {
    this.setState({ openAddContactModal: true });
  };

  _handleCloseModal = () => {
    this.setState({ openAddContactModal: false });
  };

  _handleChange = emails => event => {
    this.setState({
      emails: event.target.value,
    });
  };

  _handleChangeSendType = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  _handleDeleteContact = contactId => evt => {
    evt.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea eliminar este contacto?'
      )
    ) {
      client
        .delete(`${URLS.CONTACTS}/${contactId}`)
        .then(({ data }) => {
          this.props.getAllContacts(this._updateContacts);
          this.props.setMessage('Se ha eliminado el contacto.')
        })
        .catch(err => {
          this.setState({
            showMessage: true,
            message: err.response.data.message || 'Ha ocurrido un error.',
          });
        });
    }
  };

  render() {
    const {
      subject,
      body,
      showMessage,
      message,
      isSubmitting,
      openAddContactModal,
      users,
      contacts,
      emails
    } = this.state;

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Gestionar destinatarios"
              cardSubtitle="Aquí podrás manejar tus contactos."
              content={
                <Grid container>
                  <ItemGrid xs={12} sm={12} md={6}>
                    <RegularCard
                      headerColor="purple"
                      cardTitle="Mis Usuarios"
                      cardSubtitle="Usuarios de mi organización."
                      content={
                        <ReactTable
                          filterable
                          defaultFilterMethod={this.props._filterCaseInsensitive}
                          defaultPageSize={10}
                          columns={[
                            {
                              Header: "#",
                              id: "row",
                              maxWidth: 50,
                              filterable: false,
                              Cell: (row) => {
                                return <div style={{textAlign: 'center'}}>{row.index+1}</div>;
                              }
                            },
                            {
                              Header: 'Email ⇵',
                              accessor: 'email',
                              width: 200,
                              id: 'name',
                              Filter: ({ filter, onChange }) =>
                                <input
                                  onChange={event => onChange(event.target.value)}
                                  style={{ width: '100%' }}
                                  placeholder='Buscar'
                                />
                            },
                            {
                              Header: 'Opciones',
                              id: 'options',
                              filterable: false,
                              sotable: false,
                              accessor: user => (
                                <Link to={`/users/${user.id}`}>Ver Más</Link>
                              ),
                            },
                          ]}
                          data={users}
                        />
                      }
                    />
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={6}>
                    <RegularCard
                      headerColor="orange"
                      cardTitle="Contactos"
                      cardSubtitle="Contactos externos de mi organización."
                      content={
                        <ReactTable
                          filterable
                          defaultFilterMethod={this._filterCaseInsensitive}
                          defaultPageSize={10}
                          columns={[
                            {
                              Header: "#",
                              id: "row",
                              maxWidth: 50,
                              filterable: false,
                              Cell: (row) => {
                                return <div style={{textAlign: 'center'}}>{row.index+1}</div>;
                              }
                            },
                            {
                              Header: 'Email ⇵',
                              accessor: 'email',
                              width: 200,
                              id: 'email',
                              Filter: ({ filter, onChange }) =>
                                <input
                                  onChange={event => onChange(event.target.value)}
                                  style={{ width: '100%' }}
                                  placeholder='Buscar'
                                />
                            },
                            {
                              Header: 'Opciones',
                              id: 'options',
                              filterable: false,
                              sortable: false,
                              accessor: contact =>
                                <IconButton href='#' onClick={this._handleDeleteContact(contact.id)}>
                                  <Delete />
                                </IconButton>
                            },
                          ]}
                          data={contacts}
                        />
                      }
                    />
                  </ItemGrid>
                </Grid>
              }
            />
          </ItemGrid>
        </Grid>

        <Button
          onClick={this._handleClickAddContact}
          variant="fab"
          color="info"
          aria-label="addContact"
          customClasses="floating-button"
          round
        >
          <PersonAdd />
        </Button>

        <Dialog
          open={openAddContactModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Crear Contactos</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                this.state.csv ?
                  'Selecciona el archivo que deseas importar.'
                :
                  'Digite los correos electrónicos de los contactos que desea crear. Debe separar los correos por comas(,)'
              }
            </DialogContentText>
            <br />
            {
              this.state.csv ?
                <React.Fragment>
                  <label>Importar Archivo</label>
                  <br />
                  <input
                    ref={el => (this.file = el)}
                    accept="text/*"
                    id="raised-button-file"
                    multiple
                    type="file"
                  />
                  <br />
                  <a href="https://s3-us-west-1.amazonaws.com/clazbooks/production/corp_files/contacts.csv" _target='blank'>
                    Descarga archivo de ejemplo.
                  </a>
                </React.Fragment>
              :
              <TextField
                autoFocus
                margin="dense"
                id="emails"
                name="emails"
                multiline={true}
                onChange={this._handleChange()}
                value={emails}
                label="Correos electrónicos"
                fullWidth
              />
            }
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.csv}
                      onChange={this._handleChangeSendType('csv')}
                      value={'csv'}
                    />
                  }
                  label={this.state.csv ? 'Archivo' : 'Manual'}
                />
              </FormGroup>
              <FormHelperText>Activa esta casilla si deseas importar un archivo con contactos.</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._handleCloseModal} color="primary">
              <Cancel /> Cancelar
            </Button>
            <Button onClick={this._handleAddContact} color="info">
              <PersonAdd /> Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Contacts;
