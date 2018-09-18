import React from "react";

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
  AddCircleOutline,
  Add,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "material-ui";

import { SessionConsumer } from "components/Session/SessionContext.jsx";

import { StatsCard, ChartCard, RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';

import { Link } from "react-router-dom";
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Assessments extends React.Component {
  state = {
    status: "loading",
    currentAssessment: {
      id: null,
      book_id: '',
      name: '',
      duration: '',
      approval_value: '',
      expiration_date: '',
    },
    published_assessments: 0,
    assessments: [],
    books: [],
    editForm: false,
    openFormModal: false,
    showMessage: false,
    isSubmitting: false,
  };

  componentDidMount() {
    this._getAllAssessments();
    this._getAllBooks();
  }

  _getAllAssessments = () => {
    return client
      .get(URLS.ASSESSMENTS)
        .then(({ data: assessments }) => {
          this.setState({
            ...assessments,
            ...{published_assessments: assessments.assessments.length},
            status: "success"
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  };

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

  _filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
        true
    );
  };

  _handleEdit = assessment => event => {
    event.preventDefault();
    assessment.book_id = assessment.book.id;
    assessment.expiration_date = new Date(assessment.expiration_date).toISOString().slice(0,10);
    this.setState({
      currentAssessment: { ...assessment },
      openFormModal: true,
      editForm: true,
    });
  };

  _handleDestroy = assessment => event => {
    event.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea eliminar este examen?'
      )
    ) {
      client
        .delete(`${URLS.ASSESSMENTS}/${assessment.id}`)
        .then(({ data }) => {
          this.setState({
            showMessage: true,
            message: 'Se ha eliminado el examen.',
          }, () => {
            this._getAllAssessments();
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

  _handleAddNewAssessment = () => {
    this.setState({ openFormModal: true });
  };

  _handleClose = () => {
    this.setState({
      openFormModal: false,
      currentAssessment: {
        id: null,
        book_id: '',
        name: '',
        duration: '',
        approval_value: '',
        expiration_date: '',
      },
      editForm: false,
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentAssessment: {
        ...this.state.currentAssessment,
        [field]: event.target ? event.target.value : event,
      },
    });
  };

  _successSave = data => {
    let message = '';
    const assessmentId = data.assessment && data.assessment.id;
    if (data.errors && data.errors.length >= 1) {
      message = data.errors
        .map(error => {
          return error;
        })
        .join('-');
    }
    this._getAllAssessments();
    this.setState({
      openFormModal: false,
      currentAssessment: {
        id: null,
        book_id: '',
        name: '',
        duration: '',
        approval_value: '',
        expiration_date: '',
      },
      isSubmitting: false,
      showMessage: true,
      editForm: false,
      message: message || 'Se ha guardado el examen.',
    }, () => {
      this.props.history.push(`/questions/${assessmentId}`);
    });
  };

  _handleSubmit = event => {
    event.preventDefault();
    this.setState(
      {
        isSubmitting: true,
      },
      () => {
        const assessmentParams = {
          name: this.name.value,
          book_id: this.state.currentAssessment.book_id,
          duration: this.duration.value,
          approval_value: this.approval_value.value,
          expiration_date: this.expiration_date.value,
        }

        const method = this.state.editForm ? 'put' : 'post';
        const url = this.state.editForm
          ? `${URLS.ASSESSMENTS}${this.state.currentAssessment.id}`
          : URLS.ASSESSMENTS;

        if ( this.name.value || this.state.currentAssessment.book_id || this.duration.value
              || this.approval_value.value || this.expiration_date.value ) {
          client[method](url, { assessment: assessmentParams } )
            .then(({ data }) => {
              if (data.errors) {
                this._handleError(data.errors, false);
              } else{
                this._successSave(data);
              }
            })
            .catch(error => {
              this._handleError(error, false);
            });
        } else {
          this._handleError('No se han realizado cambios.', true);
        }
      }
    );
  };

  _handleError = (errorMessage, hideModal) => {
    const message = errorMessage.constructor == Array ? errorMessage.join(' - ') : errorMessage;
    if (hideModal) {
      this.setState({
        currentAssessment: {
          id: null,
          book_id: '',
          name: '',
          duration: '',
          approval_value: '',
          expiration_date: '',
        },
        showMessage: true,
        isSubmitting: false,
        message: message,
        openFormModal: false,
      });
    } else {
      this.setState({
        showMessage: true,
        isSubmitting: false,
        message: message,
      });
    }
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  _handleClickSave = () => {
    this.setState({ openFormModal: true });
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
      published_assessments,
      assessments,
      showMessage,
      message,
      openFormModal,
      currentAssessment,
      isSubmitting,
      editForm,
      books,
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
                    title="Exámenes publicados"
                    description={published_assessments}
                    small=""
                    statIcon={Done}
                    statIconColor="danger"
                    statText="Cantidad de exámenes publicados"
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={DoneAll}
                    iconColor="orange"
                    title=""
                    description={''}
                    statIcon={DoneAll}
                    statText=""
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={Web}
                    iconColor="green"
                    title=""
                    description={''}
                    statIcon={Web}
                    statText=""
                  />
                </ItemGrid>
              </Grid>
              <Grid container>
                <ItemGrid xs={12} sm={12} md={12}>
                  <RegularCard
                    headerColor="blue"
                    cardTitle="Exámenes"
                    cardSubtitle="Estos son los exámenes realizados por tu organización."
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
                            Header: 'Libro',
                            id: 'thumbnail_image_url',
                            filterable: false,
                            sortable: false,
                            accessor: assessment =>
                              assessment.book.thumbnail_image_url ? (
                                <img
                                  style={{
                                    width: '45px',
                                    borderRadius: '8px',
                                    margin: '0 auto',
                                    display: 'inherit',
                                  }}
                                  src={assessment.book.thumbnail_image_url}
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
                            Header: 'Duración ⇵',
                            accessor: 'duration',
                            id: 'duration',
                            Filter: ({ filter, onChange }) =>
                              <input
                                onChange={event => onChange(event.target.value)}
                                style={{ width: '100%' }}
                                placeholder='Buscar'
                              />
                          },
                          {
                            Header: '% de aprovación ⇵',
                            accessor: 'approval_value',
                            id: 'approval_value',
                            Filter: ({ filter, onChange }) =>
                              <input
                                onChange={event => onChange(event.target.value)}
                                style={{ width: '100%' }}
                                placeholder='Buscar'
                              />
                          },
                          {
                            Header: 'Fecha de expiración ⇵',
                            id: 'expiration_date',
                            accessor: assessment =>
                              new Date(assessment.expiration_date).toISOString().slice(0,10),
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
                            accessor: assessment =>
                              <React.Fragment>
                                <a href="#" onClick={this._handleEdit(assessment)}>
                                  Editar
                                </a>
                                {' - '}
                                <Link to={`/questions/${assessment.id}`}>Preguntas</Link>
                              </React.Fragment>
                          },
                        ]}
                        data={assessments}
                      />
                    }
                  />
                </ItemGrid>
                <Button
                  onClick={this._handleClickSave}
                  variant="fab"
                  color="info"
                  aria-label="saveAssessment"
                  customClasses="floating-button"
                  round
                >
                  <Add />
                </Button>
              </Grid>

              <Dialog
                open={this.state.openFormModal}
                aria-labelledby="form-dialog-title"
              >
                <form onSubmit={this._handleSubmit}>
                  <DialogTitle id="form-dialog-title">
                    {this.state.editForm ? 'Editar Examen' : 'Crear Nuevo Examen'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {this.state.editForm ? 'Ingrese la información del examen que desea modificar.' : 'Ingrese la información del examen que desea crear.'}
                    </DialogContentText>

                    <TextField
                      autoFocus
                      id="name"
                      label="Nombre"
                      name="name"
                      inputRef={ref => (this.name = ref)}
                      onChange={this._handleChange('name')}
                      value={currentAssessment.name}
                      fullWidth
                      margin="normal"
                      required
                    />

                    <FormControl style={{minWidth: '290px'}}>
                     <InputLabel htmlFor="age-simple">Seleccionar Libro</InputLabel>
                     <Select
                       value={this.state.editForm ?  currentAssessment.book_id : currentAssessment.book_id }
                       onChange={this._handleChange('book_id')}
                       name='book_id'
                       fullWidth
                       inputRef={ref => (this.book_id = ref)}
                       inputProps={{
                         name: 'book',
                         id: 'book_id',
                       }}
                     >
                       {
                        books.map((author, i) =>
                          <MenuItem value={author.id} key={i}>{author.name}</MenuItem>
                        )
                       }
                     </Select>
                    </FormControl>

                    <TextField
                      type="number"
                      inputProps={{ min: "1" }}
                      id="duration"
                      label="Duración(Minutos)"
                      name="duration"
                      inputRef={ref => (this.duration = ref)}
                      onChange={this._handleChange('duration')}
                      value={currentAssessment.duration}
                      fullWidth
                      margin="normal"
                      required
                    />
                    <TextField
                      type="number"
                      inputProps={{ min: "1", max: "100" }}
                      id="approval_value"
                      label="Porcentaje de aprobación"
                      name="approval_value"
                      inputRef={ref => (this.approval_value = ref)}
                      onChange={this._handleChange('approval_value')}
                      value={currentAssessment.approval_value}
                      fullWidth
                      margin="normal"
                      required
                    />
                    <TextField
                      type="date"
                      id="expiration_date"
                      label=""
                      name="expiration_date"
                      inputRef={ref => (this.expiration_date = ref)}
                      onChange={this._handleChange('expiration_date')}
                      value={currentAssessment.expiration_date}
                      fullWidth
                      margin="normal"
                      required
                    />
                    <label htmlFor="expiration_date">Fecha de expiración *</label>
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
          )
        }
      </SessionConsumer>
    );
  }
}

export default withStyles(dashboardStyle)(Assessments);
