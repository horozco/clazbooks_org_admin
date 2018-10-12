import React from "react";

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
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
} from "material-ui";

import { RegularCard, ItemGrid, Button, Table} from "components";
import ReactTable from 'react-table';

import client from '../../utils/client';
import URLS from '../../constants/urls.js';

import {
  Visibility,
  Delete,
  Cancel,
  Add,
  Save,
} from "@material-ui/icons";

class Lists extends React.Component {
  state = {
    contactLists: this.props.contactLists || [],
    currentContactList: {name: '', userEmails: [], contactEmails: []},
    openAddContactListModal: false,
    isSubmitting: false,
    show: false
  };

  componentDidMount() {
    // this._getAllPosts();
  }

  _updateLists = (data) => {
    this.setState({
      contactLists: data.contact_lists
    });
  };

  _handleShowList = list => evt => {
    evt.preventDefault();
    this.setState({
      currentContactList: list,
      openAddContactListModal: true,
      show: true,
    })
  };

  _handleDeleteList = listId => evt => {
    evt.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea eliminar esta lista?'
      )
    ) {
      client
        .delete(`${URLS.CONTACT_LISTS}/${listId}`)
        .then(({ data }) => {
          this.props.getAllLists(this._updateLists);
          this.props.setMessage('Se ha eliminado la lista.')
        })
        .catch(err => {
          this.setState({
            showMessage: true,
            message: err.response.data.message || 'Ha ocurrido un error.',
          });
        });
    }
  };

  _handleClickAddList = () => {
    this.setState({ openAddContactListModal: true });
  };

  _handleCloseModal = (evt) => {
    evt.preventDefault();
    this.setState({
      currentContactList: {name: '', userEmails: [], contactEmails: []},
      openAddContactListModal: false,
      show: false
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentContactList: {
        ...this.state.currentContactList,
        [field]: event.target.value,
      },
    });
  };

  _handleAddList = (evt) => {
    evt.preventDefault();
    var message = undefined;
    client
      .post(URLS.CONTACT_LISTS,
        {
          contact_list: {
            name: this.state.currentContactList.name,
            emails: [...this.state.currentContactList.userEmails, ...this.state.currentContactList.contactEmails].join(',')
          }
        }
      )
      .then(({ data }) => {
        if (data.errors && data.errors.length >= 1) {
          message = data.errors;
          this.props.setMessage(message);
        } else {
          this.props.setMessage('La lista de contactos ha sido creada.')
          this.setState({
            openAddContactListModal: false,
            currentContactList: {name: '', userEmails: [], contactEmails: []},
            contact_list: this.props.contact_list
          });
          this.props.getAllLists(this._updateLists);
        }
      })
      .catch(error => {
        this.props.setMessage('Ha ocurrido un error: ' + error.message);
      });
  };

  render() {
    const {
      contactLists,
      isSubmitting,
      currentContactList,
      openAddContactListModal,
      show
    } = this.state;

    const {
      users,
      contacts,
    } = this.props;

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Gestiona tus listas de destinatarios"
              cardSubtitle="Aquí puedes obtener más información sobre tus listas."
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
                      Header: 'Nombre ⇵',
                      accessor: 'name',
                      width: 250,
                      id: 'name',
                      Filter: ({ filter, onChange }) =>
                        <input
                          onChange={event => onChange(event.target.value)}
                          style={{ width: '100%' }}
                          placeholder='Buscar'
                        />
                    },
                    {
                      Header: 'Emails ⇵',
                      accessor: 'emails',
                      width: 350,
                      id: 'emails',
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
                      maxWidth: 100,
                      filterable: false,
                      sotable: false,
                      accessor: list => (
                        <React.Fragment>
                          <IconButton href='#' onClick={this._handleShowList(list)}>
                            <Visibility />
                          </IconButton>
                          <IconButton href='#' onClick={this._handleDeleteList(list.id)}>
                            <Delete />
                          </IconButton>
                        </React.Fragment>
                      ),
                    },
                  ]}
                  data={contactLists}
                />
              }
            />
          </ItemGrid>
        </Grid>

        <Button
          onClick={this._handleClickAddList}
          variant="fab"
          color="info"
          aria-label="addContact"
          customClasses="floating-button"
          round
        >
          <Add />
        </Button>

        <Dialog
          open={openAddContactListModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {
              show ?
                `Nombre: ${currentContactList.name}` :
              'Crear lista de contactos'
            }
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                show ?
                  `${currentContactList.emails.length} emails`
                  : 'Seleccione los contactos y usuarios que desea agregar a la lista.'
              }
            </DialogContentText>
            {
              show ?
                <RegularCard
                  headerColor="orange"
                  cardTitle="Emails"
                  cardSubtitle="Emails de la lista."
                  content={
                    <Table
                      tableHeaderColor="info"
                      tableHead={[
                        "#",
                        "Email"
                      ]}
                      tableData={currentContactList.emails.map((email, index) => {
                        return [index+1, email]
                      })}
                    />
                  }
                />
                :
                <React.Fragment>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    onChange={this._handleChange('name')}
                    value={currentContactList.name}
                    label="Nombre"
                    fullWidth
                  />
                  <br />
                  <FormControl style={{minWidth: '290px'}}>
                   <InputLabel htmlFor="age-simple">Mis usuarios</InputLabel>
                   <Select
                     multiple
                     name='users'
                     value={currentContactList.userEmails}
                     onChange={this._handleChange('userEmails')}
                     inputProps={{
                       name: 'userEmails',
                       id: 'userEmails',
                     }}
                   >
                     {
                      this.props.users.map((user, key) =>
                        <MenuItem value={user.email}  key={key}>{user.email}</MenuItem>
                      )
                     }
                   </Select>
                  </FormControl>
                  <br />
                  <br />
                  <FormControl style={{minWidth: '290px'}}>
                   <InputLabel htmlFor="age-simple">Mis contactos</InputLabel>
                   <Select
                     multiple
                     name='users'
                     value={currentContactList.contactEmails}
                     onChange={this._handleChange('contactEmails')}
                     inputProps={{
                       name: 'contactEmails',
                       id: 'contactEmails',
                     }}
                   >
                     {
                      this.props.contacts.map((contact, key) =>
                        <MenuItem value={contact.email} key={key}>{contact.email}</MenuItem>
                      )
                     }
                   </Select>
                  </FormControl>
                </React.Fragment>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this._handleCloseModal} color="primary">
              <Cancel /> Cancelar
            </Button>
            {
              show ? null
              :
              <Button onClick={this._handleAddList} color="info">
                <Save /> Crear
              </Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Lists;
