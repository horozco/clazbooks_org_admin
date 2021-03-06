import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  TextField,
  Checkbox,
  Select,
  MenuItem,
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
    currentBook: { id: null, name: '', original_name: '', author_id: '', categories: [], published: null, thumbnail_image_url: '' },
    organization_id: '',
    image: '',
    audio: '',
    editForm: false,
    openFormModal: false,
    showMessage: false,
    isSubmitting: false,
    authors: [],
    books: [],
  };

  componentDidMount() {

    this._getAllCategories().then(() => {
      this._getAllAuthors().then(() => {
        this._getAllBooks();
      });
    })
  }

  _getAllBooks = () => {
    return client
      .get(URLS.BOOKS)
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

  _getAllAuthors = () => {
    return client
      .get(URLS.AUTHORS)
      .then(({ data }) => {
        this.setState({
          ...data,
        });
      })
      .catch(() => {
        this.setState({
          status: 'error',
        });
      });
  };

  _getAllCategories = () => {
    return client
      .get(URLS.CATEGORIES)
      .then(({ data }) => {
        this.setState({
          ...data,
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
      currentBook: { id: null, name: '', original_name: '', author_id: '', categories: [], published: null, thumbnail_image_url: '' },
      iamge: '',
      editForm: false,
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentBook: {
        ...this.state.currentBook,
        [field]: event.target.value,
      },
    });
  };

  _handlePublishedChange = () => event => {
    this.setState({
      currentBook: {
        ...this.state.currentBook,
        published: event.target.checked
      },
    });
  };

  _successSave = data => {
    var message = '';
    var newBookId = data.book && data.book.id;
    if (data.errors && data.errors.length >= 1) {
      message = data.errors
        .map(error => {
          return error;
        })
        .join('-');
      this._handleError(`Ha ocurrido un error: ${message}`, false);
    } else {
      this._getAllBooks().then( () => {
        this.setState({
          openFormModal: false,
          currentBook: { id: null, name: '', original_name: '', author_id: '', categories: [], published: null, thumbnail_image_url: '' },
          image: '',
          isSubmitting: false,
          showMessage: true,
          editForm: false,
          message: message || 'Se ha guardado el libro.',
        }, () => {
          this.props.history.push(`/readers/${newBookId}`);
        });
      })
    }
  };

  _handleError = (errorMessage, hideModal=true) => {
    this.setState({
      currentBook: hideModal ? { id: null, name: '', original_name: '', author_id: '', categories: [], published: null, thumbnail_image_url: '' } : this.state.currentBook,
      image: '',
      success: true,
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
      openFormModal: !hideModal,
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
          formData.append('book[name]', this.name.value);
        }

        if (this.original_name.value) {
          formData.append('book[original_name]', this.original_name.value);
        }

        if (this.state.currentBook.author_id) {
          formData.append('book[author_id]', this.state.currentBook.author_id);
        }

        if (this.published.value) {
          formData.append('book[published]', this.published.value === 'true' ? true : false);
        }

        if (this.state.currentBook.categories) {
          formData.append('book[category_ids]', this.state.currentBook.categories);
        }

        if (this.image.value) {
          formData.append('book[image]', this.image.files[0]);
        }

        if (this.audio.value) {
          formData.append('book[audio]', this.audio.files[0]);
        }

        formData.append('book[organization_id]', organizationId);

        const method = this.state.editForm ? 'put' : 'post';
        const url = this.state.editForm
          ? `${URLS.BOOKS}${this.state.currentBook.id}`
          : URLS.BOOKS;

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

  _handleEdit = book => event => {
    event.preventDefault();
    this.setState({
      currentBook: { ...book, categories: book.categories.map(category => category.id) },
      openFormModal: true,
      editForm: true,
    });
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

  _handleDestroy = book => event => {
    event.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea eliminar este libro?'
      )
    ) {
      client
        .delete(`${URLS.BOOKS}/${book.id}`)
        .then(({ data }) => {
          this.setState({
            showMessage: true,
            message: 'Se ha eliminado el libro.',
          }, () => {
            this._getAllBooks();
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

  render() {
    const {
      status,
      books,
      showMessage,
      message,
      openFormModal,
      currentBook,
      image,
      isSubmitting,
      authors,
      categories
    } = this.state;

    const currentOrganizationId = getOrganization().id;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <React.Fragment>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {books ? (
              <RegularCard
                cardTitle="Libros"
                cardSubtitle="Lista de libros creados por Clazbooks y por tu organización. Para publicar un libro, selecciona el ícono de más (+) y sigue los pasos."
                content={
                  <ReactTable
                    loading={this.state.status === 'loading'}
                    filterable
                    defaultFilterMethod={this._filterCaseInsensitive}
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
                        Header: 'Foto',
                        id: 'thumbnail_image_url',
                        filterable: false,
                        sortable: false,
                        accessor: book =>
                          book.thumbnail_image_url ? (
                            <img
                              style={{
                                width: '45px',
                                borderRadius: '8px',
                                margin: '0 auto',
                                display: 'inherit',
                              }}
                              src={book.thumbnail_image_url}
                            />
                          ) : null,
                      },
                      {
                        Header: 'Nombre ⇵',
                        accessor: 'name',
                        id: 'name',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Autor ⇵',
                        accessor: 'author.name',
                        id: 'author',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Categorías ⇵',
                        filterable: false,
                        accessor: 'categories[0].name',
                        id: 'category',
                      },
                      {
                        Header: '¿Mi libro? ⇵',
                        filterable: false,
                        id: 'organization',
                        accessor: book =>
                          book.organization_id == currentOrganizationId ? 'Sí' : 'No',
                      },
                      {
                        Header: 'Opciones',
                        id: 'options',
                        filterable: false,
                        accessor: book =>
                          book.organization_id === currentOrganizationId ? (
                            <React.Fragment>
                              <a href="#" onClick={this._handleEdit(book)}>
                                Editar
                              </a>
                              {' - '}
                              <a href="#" onClick={this._handleDestroy(book)}>
                                Eliminar
                              </a>
                            </React.Fragment>
                          ) : null,
                      },
                    ]}
                    data={books}
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
            aria-label="saveBook"
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
              {this.state.editForm ? 'Editar Libro - ' : 'Crear Nuevo Libro'}
              {
                currentBook.id ?
                  <Link to={`/readers/${currentBook.id}`}>Contenido</Link> : ''
              }
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.editForm ? 'Ingrese la información del libro que desea modificar.' : 'Ingrese la información del libro que desea crear.'}
              </DialogContentText>
              <div>
                {this.state.editForm ? (
                  <img
                    style={{
                      width: '45px',
                      borderRadius: '8px',
                      margin: '0 auto',
                      display: 'inherit',
                    }}
                    src={this.state.currentBook.thumbnail_image_url}
                  />
                ) : null}
              </div>
              <TextField
                autoFocus
                id="name"
                label="Nombre del libro"
                name="name"
                inputRef={ref => (this.name = ref)}
                onChange={this._handleChange('name')}
                value={currentBook.name}
                fullWidth
                margin="normal"
              />
              <TextField
                id="original_name"
                label="Nombre original"
                name="original_name"
                inputRef={ref => (this.original_name = ref)}
                onChange={this._handleChange('original_name')}
                value={currentBook.original_name}
                fullWidth
                margin="normal"
              />
              <FormControl style={{minWidth: '290px'}}>
               <InputLabel htmlFor="age-simple">Seleccionar Autor</InputLabel>
               <Select
                 value={this.state.editForm ?  (currentBook.author && currentBook.author.id) : currentBook.author_id }
                 onChange={this._handleChange('author_id')}
                 name='author_id'
                 inputRef={ref => (this.author_id = ref)}
                 inputProps={{
                   name: 'author',
                   id: 'author_id',
                 }}
               >
                 {
                  authors.map(author =>
                    <MenuItem value={author.id}>{author.name}</MenuItem>
                  )
                 }

               </Select>
              </FormControl>
              <FormControl style={{minWidth: '290px'}}>
               <InputLabel htmlFor="age-simple">Seleccionar Categorías</InputLabel>
               <Select
                 multiple
                 name='categories'
                 inputRef={ref => (this.categories = ref)}
                 value={currentBook.categories}
                 onChange={this._handleChange('categories')}
                 inputProps={{
                   name: 'categories',
                   id: 'categories',
                 }}
               >
                 {
                  categories.map(category =>
                    <MenuItem value={category.id}>{category.name}</MenuItem>
                  )
                 }
               </Select>
              </FormControl>
              <br />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentBook.published}
                    name='published'
                    inputRef={ref => (this.published = ref)}
                    onChange={this._handlePublishedChange()}
                    value='true'
                  />
                }
                label="Seleccionar esta opción para publicarlo"
              />
              <br />
              <br />
              <label>
                <b>Carátula</b>
                <small style={{display: 'block'}}>Puedes dejarla en blanco si no tienes una a la mano.</small>
              </label>
              <input
                ref={el => (this.image = el)}
                accept="image/*"
                id="raised-button-file"
                multiple
                type="file"
              />
              <br />
              <br />
              <label>
                <b>Audio</b>
                <small style={{display: 'block'}}>Puedes dejarlo en blanco si no tienes uno a la mano.</small>
              </label>
              <input
                ref={el => (this.audio = el)}
                accept="audio/*"
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
                <SaveIcon /> Siguiente
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default withRouter(Books);
