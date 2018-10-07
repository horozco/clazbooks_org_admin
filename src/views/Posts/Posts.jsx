import React from "react";
import PropTypes from "prop-types";

import {
  Done,
  DoneAll,
  Web,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility,
  Save,
  Cancel,
  Close,
  AddCircleOutline
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

import { SessionConsumer } from "components/Session/SessionContext.jsx";

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
    currentPost: { id: null, title: '', md_content: '' },
    published_posts: 0,
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
    if (post.published) {
      event.preventDefault();
      if (
        window.confirm(
          '¿Está seguro que desea despublicar este mensaje?'
        )
      ) {
        return client
          .post(`${URLS.POSTS}/${post.id}/unpublish`)
            .then(({}) => {
              this._getAllPosts();
            })
            .catch(() => {
              this.setState({
                status: "error"
              });
            });
      }
    } else {
      this._handlePublish(post);
    }
  };

  _handlePublish = post => {
    return client
      .post(`${URLS.POSTS}/${post.id}/publish`)
        .then(({}) => {
          this._getAllPosts();
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
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
        '¿Está seguro que desea eliminar este mensaje?'
      )
    ) {
      client
        .delete(`${URLS.POSTS}/${post.id}`)
        .then(({ data }) => {
          this.setState({
            showMessage: true,
            message: 'Se ha eliminado el mensaje.',
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
      currentPost: { id: null, title: '', md_content: '' },
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
      currentPost: { id: null, title: '', md_content: '' },
      isSubmitting: false,
      showMessage: true,
      editForm: false,
      message: message || 'Se ha guardado el mensaje.',
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

        if (this.md_content.value) {
          formData.append("post[new_reader_attributes][md_content]", this.md_content.value);
        }

        const method = this.state.editForm ? 'put' : 'post';
        const url = this.state.editForm
          ? `${URLS.POSTS}${this.state.currentPost.id}`
          : URLS.POSTS;

        if (this.title.value || this.md_content.value) {
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
      currentPost: { id: null, title: '', intro: '', md_content: '' },
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
      <SessionConsumer>
        {
          session => (
            <div>
              <Grid container>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={Done}
                    iconColor="red"
                    title="Mensajes Publicados"
                    description={published_posts}
                    small=""
                    statIcon={Done}
                    statIconColor="danger"
                    statText="Número de mensajes que has publicado."
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={DoneAll}
                    iconColor="orange"
                    title="Mensajes Leídos"
                    description={session.organization_admin.organization.posts_read_amount}
                    statIcon={DoneAll}
                    statText="Número de mensajes que tus usuarios han leído."
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={Web}
                    iconColor="green"
                    title="Publicar Nuevo Mensaje"
                    description={<Button variant="fab" color="info" aria-label="addPost" customClasses="addButton"> <AddCircleOutline /> </Button>}
                    statIcon={Web}
                    statText="Agrega un nuevo mensaje."
                    onClick={this._handleAddNewPost}
                  />
                </ItemGrid>
              </Grid>
              <Grid container>
                <ItemGrid xs={12} sm={12} md={12}>
                  <RegularCard
                    headerColor="blue"
                    cardTitle="Mensajes"
                    cardSubtitle="Estas son los Mensajes que has creado."
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
                            Header: 'Título ⇵',
                            id: 'title',
                            accessor: 'title',
                            Filter: ({ filter, onChange }) =>
                              <input
                                onChange={event => onChange(event.target.value)}
                                style={{ width: '100%' }}
                                placeholder='Buscar'
                              />
                          },
                          {
                            Header: 'Fecha de publicación ⇵',
                            id: 'created_at',
                            accessor: post =>
                              new Date(post.created_at).toLocaleString(),
                            Filter: ({ filter, onChange }) =>
                              <input
                                onChange={event => onChange(event.target.value)}
                                style={{ width: '100%' }}
                                placeholder='Buscar'
                              />
                          },
                          {
                            Header: 'Publicado ⇵',
                            id: 'published',
                            accessor: post =>
                              post.published ? 'Sí' : 'No',
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
                            accessor: post =>
                              <React.Fragment>
                                <a href="#" onClick={this._handleUnpublish(post)}>
                                  { post.published ? 'Despublicar' : 'Publicar'}
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
                    {this.state.editForm ? 'Editar Mensaje' : 'Crear Nuevo Mensaje'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {this.state.editForm ? 'Ingrese la información del mensaje que desea modificar.' : 'Ingrese la información del mensaje que desea crear.'}
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
                      required
                    />
                    <br/>
                    <br/>
                    <SimpleMDE
                      ref={ref => (this.md_content = ref)}
                      name='md_content'
                      value={currentPost.md_content}
                      onChange={this._handleChange('md_content')}
                      required
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
            </div>
          )
        }
      </SessionConsumer>
    );
  }
}

Posts.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Posts);
