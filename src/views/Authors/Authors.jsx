import React from 'react';
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  IconButton,
} from 'material-ui';
import { Link } from 'react-router-dom';

import client from '../../utils/client';
import URLS from '../../constants/urls.js';
import { getOrganization } from '../../utils/session.js';

import { RegularCard, ItemGrid, Button } from 'components';
import ReactTable from 'react-table';

import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import Close from '@material-ui/icons/Close';

class Books extends React.Component {
  state = {
    status: 'loading',
    message: '',
    currentAuthor: { id: null, name: '', s3_image_url: '' },
    organization_id: '',
    image: '',
    editForm: false,
    openFormModal: false,
    showMessage: false,
    isSubmitting: false,
    authors: [],
  };

  componentDidMount() {
    this._getAllAuthors();
  }

  _getAllAuthors = () => {
    return client
      .get(URLS.AUTHORS)
      .then(({ data }) => {
        this.setState({
          ...data,
          status: 'success',
        });
      })
      .catch(() => {
        this.setState({
          status: 'error',
        });
      });
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  _handleClickSend = () => {
    this.setState({ openFormModal: true });
  };

  _handleClose = () => {
    this.setState({
      openFormModal: false,
      currentAuthor: { id: null, name: '', s3_image_url: '' },
      iamge: '',
      editForm: false,
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentAuthor: {
        ...this.state.currentAuthor,
        [field]: event.target.value,
      },
    });
  };

  _successSave = data => {
    var message = '';
    if (data.errors && data.errors.length >= 1) {
      message = data.errors
        .map(error => {
          return error;
        })
        .join('-');
    }
    this._getAllAuthors();
    this.setState({
      openFormModal: false,
      currentAuthor: { id: null, name: '', s3_image_url: '' },
      image: '',
      isSubmitting: false,
      showMessage: true,
      message: message || 'Se ha guardado el autor.',
    });
  };

  _handleError = errorMessage => {
    this.setState({
      currentAuthor: { id: null, name: '', s3_image_url: '' },
      image: '',
      success: true,
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
      openFormModal: false,
    });
  };

  _handleSubmit = organizationId => event => {
    event.preventDefault();
    this.setState(
      {
        isSubmitting: true,
      },
      () => {
        const formData = new FormData();
        if (this.name.value) {
          formData.append('author[name]', this.name.value);
        }

        if (this.image.value) {
          formData.append('author[image]', this.image.files[0]);
        }

        formData.append('author[organization_id]', organizationId);
        const method = this.state.editForm ? 'put' : 'post';
        const url = this.state.editForm
          ? `${URLS.AUTHORS}${this.state.currentAuthor.id}`
          : URLS.AUTHORS;

        if (this.name.value || this.image.value) {
          client[method](url, formData)
            .then(({ data }) => {
              this._successSave(data);
            })
            .catch(error => {
              this._handleError(error);
            });
        } else {
          this._handleError('No se han realizado cambios.');
        }
      }
    );
  };

  _handleEdit = author => event => {
    event.preventDefault();
    this.setState({
      currentAuthor: { ...author },
      openFormModal: true,
      editForm: true,
    });
  };

  render() {
    const {
      status,
      authors,
      showMessage,
      message,
      openFormModal,
      currentAuthor,
      image,
      isSubmitting,
    } = this.state;

    const currentOrganizationId = getOrganization().id;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <React.Fragment>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {authors ? (
              <RegularCard
                cardTitle="Autores"
                cardSubtitle="Estos son los autores creados en clazbooks. Sólo puedes editar los que has creado."
                content={
                  <ReactTable
                    filterable
                    columns={[
                      {
                        Header: 'Foto',
                        id: 's3_image_url',
                        filterable: false,
                        accessor: author =>
                          author.s3_image_url ? (
                            <img
                              style={{
                                width: '45px',
                                borderRadius: '24px',
                                margin: '0 auto',
                                display: 'inherit',
                              }}
                              src={author.s3_image_url}
                            />
                          ) : null,
                      },
                      {
                        Header: 'Nombre',
                        accessor: 'name',
                        id: 'id',
                      },
                      {
                        Header: 'Opciones',
                        id: 'options',
                        filterable: false,
                        accessor: author =>
                          author.organization_id === currentOrganizationId ? (
                            <a href="#" onClick={this._handleEdit(author)}>
                              Editar
                            </a>
                          ) : null,
                      },
                    ]}
                    data={authors}
                  />
                }
              />
            ) : (
              ''
            )}
          </ItemGrid>
          <Button
            onClick={this._handleClickSend}
            variant="fab"
            color="info"
            aria-label="sendInvitation"
            customClasses="floating-button"
            round
          >
            <AddIcon />
          </Button>
        </Grid>
        <Dialog
          open={this.state.openFormModal}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this._handleSubmit(currentOrganizationId)}>
            <DialogTitle id="form-dialog-title">
              {this.state.editForm ? 'Editar Autor' : 'Crear Autor'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ingrese la iformación del autor que desea crear o modificar.
              </DialogContentText>
              <div>
                {this.state.editForm ? (
                  <img
                    style={{
                      width: '45px',
                      borderRadius: '24px',
                      margin: '0 auto',
                      display: 'inherit',
                    }}
                    src={this.state.currentAuthor.s3_image_url}
                  />
                ) : null}
              </div>
              <TextField
                autoFocus
                id="name"
                label="Escriba un Nuevo Nombre"
                name="name"
                inputRef={ref => (this.name = ref)}
                onChange={this._handleChange('name')}
                value={currentAuthor.name}
                fullWidth
                margin="normal"
              />
              <br />
              <br />
              <label>
                <b>Imagen de perfil</b>
              </label>
              <br />
              <input
                ref={el => (this.image = el)}
                accept="image/*"
                id="raised-button-file"
                multiple
                type="file"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this._handleClose} color="primary">
                <Cancel /> Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} color="primary">
                <SaveIcon /> Guardar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={showMessage}
          onClose={this._handleErrorMessageClose}
          message={<span>{this.state.message}</span>}
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
      </React.Fragment>
    );
  }
}

export default Books;
