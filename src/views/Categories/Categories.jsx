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

class Categories extends React.Component {
  state = {
    status: 'loading',
    message: '',
    currentCategory: { id: null, name: '', s3_image_url: '' },
    organization_id: '',
    image: '',
    editForm: false,
    openFormModal: false,
    showMessage: false,
    isSubmitting: false,
    categories: [],
  };

  componentDidMount() {
    this._getAllCategories();
  }

  _getAllCategories = () => {
    return client
      .get(URLS.CATEGORIES)
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

  _handleClickSave = () => {
    this.setState({ openFormModal: true });
  };

  _handleClose = () => {
    this.setState({
      openFormModal: false,
      currentCategory: { id: null, name: '', s3_image_url: '' },
      image: '',
      editForm: false,
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentCategory: {
        ...this.state.currentCategory,
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
    this._getAllCategories();
    this.setState({
      openFormModal: false,
      currentCategory: { id: null, name: '', s3_image_url: '' },
      image: '',
      isSubmitting: false,
      showMessage: true,
      editForm: false,
      message: message || 'Se ha guardado la categoría.',
    });
  };

  _handleError = errorMessage => {
    this.setState({
      currentCategory: { id: null, name: '', s3_image_url: '' },
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
          formData.append('category[name]', this.name.value);
        }

        if (this.name.value) {
          formData.append('category[tag]', this.name.value.toLowerCase());
        }

        if (this.image.value) {
          formData.append('category[image]', this.image.files[0]);
        }

        formData.append('category[organization_id]', organizationId);
        const method = this.state.editForm ? 'put' : 'post';
        const url = this.state.editForm
          ? `${URLS.CATEGORIES}${this.state.currentCategory.id}`
          : URLS.CATEGORIES;

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

  _handleEdit = category => event => {
    event.preventDefault();
    this.setState({
      currentCategory: { ...category },
      openFormModal: true,
      editForm: true,
    });
  };

  _handleDestroy = category => event => {
    event.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea eliminar esta categoría?'
      )
    ) {
      client
        .delete(`${URLS.CATEGORIES}/${category.id}`)
        .then(({ data }) => {
          this.setState({
            showMessage: true,
            message: 'Se ha eliminado la categoría.',
          }, () => {
            this._getAllCategories();
          });
        })
        .catch(err => {
          this.setState({
            showMessage: true,
            message: err.response.data.message || 'Ha ocurrido un error.',
          });
        });
    }
  };

  _filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
        true
    );
  };

  render() {
    const {
      status,
      categories,
      showMessage,
      message,
      openFormModal,
      currentCategory,
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
            {categories ? (
              <RegularCard
                cardTitle="Categorías"
                cardSubtitle="Estas son las Categorías creadas en clazbooks. Sólo puedes editar las que ha creado tu organización."
                content={
                  <ReactTable
                    filterable
                    defaultFilterMethod={this._filterCaseInsensitive}
                    columns={[
                      {
                        Header: 'Foto',
                        id: 's3_image_url',
                        filterable: false,
                        accessor: category =>
                          category.s3_image_url ? (
                            <img
                              style={{
                                width: '90%',
                                borderRadius: '4px',
                                margin: '0 auto',
                                display: 'inherit',
                              }}
                              src={category.s3_image_url}
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
                        accessor: category =>
                          category.organization && (category.organization.id === currentOrganizationId) ? (
                            <div>
                              <a href="#" onClick={this._handleEdit(category)}>
                                Editar
                              </a>
                              {' - '}
                              <a href="#" onClick={this._handleDestroy(category)}>
                                Eliminar
                              </a>
                            </div>
                          ) : null,
                      },
                    ]}
                    data={categories}
                  />
                }
              />
            ) : (
              ''
            )}
          </ItemGrid>
          <Button
            onClick={this._handleClickSave}
            variant="fab"
            color="info"
            aria-label="saveCategory"
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
              {this.state.editForm ? 'Editar Categoría' : 'Crear Categoría'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.editForm ? 'Ingrese la información de la Categoría que desea modificar.' : 'Ingrese la información de la Categoría que desea crear.'}
              </DialogContentText>
              <div>
                {this.state.editForm ? (
                  <img
                    style={{
                      width: '90%',
                      borderRadius: '4px',
                      margin: '0 auto',
                      display: 'inherit',
                    }}
                    src={this.state.currentCategory.s3_image_url}
                  />
                ) : null}
              </div>
              <TextField
                autoFocus
                id="name"
                label="Escriba un Nombre"
                name="name"
                inputRef={ref => (this.name = ref)}
                onChange={this._handleChange('name')}
                value={currentCategory.name}
                fullWidth
                margin="normal"
              />
              <br />
              <br />
              <label>
                <b>Elegir imagen para categoría</b>
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

export default Categories;
