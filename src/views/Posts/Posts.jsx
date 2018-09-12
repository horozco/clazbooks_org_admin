import React from "react";
import PropTypes from "prop-types";

import {
  Done,
  DoneAll,
  Fingerprint,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility,
  Save,
  Cancel,
  Close
} from "@material-ui/icons";

import {
  withStyles,
  Snackbar,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "material-ui";

import { StatsCard, ChartCard, RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';

import { Link } from "react-router-dom";
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

import SimpleMDE from 'react-simplemde-editor';
import "simplemde/dist/simplemde.min.css";

class Posts extends React.Component {
  state = {
    status: "loading",
    currentPost: { id: null, title: '', intro: '', body: '' },
    published_posts: 0,
    total_read_posts: 0,
    posts: [],
    editForm: false,
    openFormModal: false,
    showMessage: false,
    isSubmitting: false,

  };

  componentDidMount() {
    this._getAllPosts();
  }

  _getAllPosts = () => {
    return client
      .get(URLS.POSTS)
        .then(({ data: posts }) => {
          this.setState({
            ...posts,
            ...{published_posts: posts.posts.length},
            status: "success"
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
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

  _handleUnpublish = post => event => {
    event.preventDefault();
    alert(`Despublicando ${post.title}`)
  };

  _handleEdit = post => event => {
    event.preventDefault();
    this.setState({
      currentPost: { ...post },
      openFormModal: true,
      editForm: true,
    });
  };

  _handleDestroy = post => event => {
    event.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea eliminar esta noticia?'
      )
    ) {
      client
        .delete(`${URLS.POSTS}/${post.id}`)
        .then(({ data }) => {
          this.setState({
            showMessage: true,
            message: 'Se ha eliminado la noticia.',
          }, () => {
            this._getAllPosts();
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

  _handleAddNewPost = () => {
    this.setState({ openFormModal: true });
  };

  _handleClose = () => {
    this.setState({
      openFormModal: false,
      currentPost: { id: null, title: '', intro: '', body: '' },
      editForm: false,
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        [field]: event.target ? event.target.value : event,
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
    this._getAllPosts();
    this.setState({
      openFormModal: false,
      currentPost: { id: null, title: '', intro: '', body: '' },
      isSubmitting: false,
      showMessage: true,
      editForm: false,
      message: message || 'Se ha guardado la noticia.',
    });
  };

  _handleSubmit = event => {
    event.preventDefault();
    this.setState(
      {
        isSubmitting: true,
      },
      () => {
        const formData = new FormData();
        if (this.title.value) {
          formData.append('post[title]', this.title.value);
        }

        if (this.intro.value) {
          formData.append('post[intro]', this.intro.value);
        }

        if (this.body.value) {
          formData.append('post[body]', this.body.value);
        }

        const method = this.state.editForm ? 'put' : 'post';
        const url = this.state.editForm
          ? `${URLS.POSTS}${this.state.currentPost.id}`
          : URLS.POSTS;

        if (this.title.value || this.intro.value || this.body.value) {
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

  _handleError = errorMessage => {
    this.setState({
      currentPost: { id: null, title: '', intro: '', body: '' },
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
      openFormModal: false,
    });
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  render() {
    const {
      status,
      published_posts,
      total_read_posts,
      posts,
      showMessage,
      message,
      openFormModal,
      currentPost,
      isSubmitting,
      editForm,
    } = this.state;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Fingerprint}
              iconColor="red"
              title="Noticias Publicadas"
              description={published_posts}
              small=""
              statIcon={Fingerprint}
              statIconColor="danger"
              statText="Noticias de tu organización."
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={DoneAll}
              iconColor="orange"
              title="Noticias Leídas"
              description={total_read_posts}
              statIcon={DoneAll}
              statText="Total de noticias leídas por usuarios."
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Done}
              iconColor="green"
              title="Publicar Nueva Noticia"
              description={'+'}
              statIcon={Done}
              statText="Agrega una nueva noticia."
              onClick={this._handleAddNewPost}
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Noticias"
              cardSubtitle="Estas son las noticias que has creado."
              content={
                <ReactTable
                  loading={this.state.status === 'loading'}
                  filterable
                  defaultFilterMethod={this._filterCaseInsensitive}
                  columns={[
                    {
                      Header: 'Título',
                      id: 'title',
                      accessor: 'title'
                    },
                    {
                      Header: 'Fecha de publicación',
                      id: 'created_at',
                      accessor: post =>
                        new Date(post.created_at).toLocaleString(),
                    },
                    {
                      Header: 'Opciones',
                      id: 'options',
                      filterable: false,
                      accessor: post =>
                        <React.Fragment>
                          <a href="#" onClick={this._handleUnpublish(post)}>
                            Despublicar
                          </a>
                          {' - '}
                          <a href="#" onClick={this._handleEdit(post)}>
                            Editar
                          </a>
                          {' - '}
                          <a href="#" onClick={this._handleDestroy(post)}>
                            Eliminar
                          </a>
                        </React.Fragment>
                    },
                  ]}
                  data={posts}
                />
              }
            />
          </ItemGrid>
        </Grid>

        <Dialog
          open={this.state.openFormModal}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this._handleSubmit}>
            <DialogTitle id="form-dialog-title">
              {this.state.editForm ? 'Editar Noticia' : 'Crear Nueva Noticia'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.editForm ? 'Ingrese la información de la noticia que desea modificar.' : 'Ingrese la información de la noticia que desea crear.'}
              </DialogContentText>

              <TextField
                autoFocus
                id="title"
                label="Título"
                name="title"
                inputRef={ref => (this.title = ref)}
                onChange={this._handleChange('title')}
                value={currentPost.title}
                fullWidth
                margin="normal"
              />
              <TextField
                id="intro"
                label="Frase inicial"
                name="intro"
                inputRef={ref => (this.intro = ref)}
                onChange={this._handleChange('intro')}
                value={currentPost.intro}
                fullWidth
                margin="normal"
              />
              <br/>
              <SimpleMDE
                ref={ref => (this.body = ref)}
                name='body'
                value={currentPost.body}
                onChange={this._handleChange('body')}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this._handleClose} color="primary">
                <Cancel /> Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} color="primary">
                <Save /> Guardar
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
      </div>
    );
  }
}

Posts.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Posts);
