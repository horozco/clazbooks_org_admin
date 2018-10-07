import React from "react";

import {
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

import {
  Save,
  Cancel,
  Close,
  Add,
} from "@material-ui/icons";

import { RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';
import { Link } from "react-router-dom";
import { getOrganization } from '../../utils/session.js';
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

class New extends React.Component {
  state = {
    assessments: this.props.assessments || [],
    books: this.props.books || [],
    isSubmitting: this.props.isSubmitting || false,
    editForm: false,
    openFormModal: false,
    currentAssessment: {
      id: null,
      book_id: '',
      name: '',
      duration: '',
      approval_value: '',
      expiration_date: '',
    },
  };

  _handleAssessmentForm = book => event => {
    event.preventDefault();
    const assessment = this._assessmentFromBook(book)[0];
    if (assessment) {
      this._handleEdit(assessment);
    } else{
      this.setState({
        openFormModal: true,
        currentAssessment: {
          book_id: book.id
        }
      });
    }
  };

  _handleEdit = assessment => {
    assessment.book_id = assessment.book.id;
    assessment.expiration_date = new Date(assessment.expiration_date).toISOString().slice(0,10);
    this.setState({
      currentAssessment: { ...assessment },
      openFormModal: true,
      editForm: true,
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

  _handleError = (error, hideModal) => {
    this.setState({
        isSubmitting: false
      }, this.props.handleError(error, false)
    )
  }

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
                this._handleError(data.errors, false)
              } else{
                this._successSave(data);
              }
            })
            .catch(error => {
              this._handleError(error, false)
            });
        } else {
          this.props.handleError('No se han realizado cambios.', true);
        }
      }
    );
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

  _filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
        true
    );
  };

  _assessmentFromBook = (book) => (
    this.props.assessments.filter(
      (assessment) => assessment.book.id === book.id
    )
  )

  render() {
    const {
      assessments,
      books,
    } = this.props;

    const {
      currentAssessment,
      isSubmitting,
      openFormModal
    } = this.state;

    const orgBooks = this.state.books.filter((item) => item.organization_id === getOrganization().id) || [];
    const clazBooks = this.state.books.filter((item) => item.organization_id === null) || [];

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            headerColor="blue"
            cardTitle="Gestionar Exámenes"
            cardSubtitle="Para crear un exámen debes elegir un contenido creado por ti o por Clazbooks."
            content={
              <div>
                <Grid container>
                  <ItemGrid xs={12} sm={12} md={6}>
                    <RegularCard
                      headerColor="purple"
                      cardTitle="Mi contenido"
                      cardSubtitle="Libros que ha publicado mi organización."
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
                              Header: 'Name ⇵',
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
                              Header: 'Examen ⇵',
                              id: 'assessment',
                              accessor: book =>
                                this._assessmentFromBook(book).length > 0 ? 'Sí' : 'No',
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
                              accessor: book =>
                                <a href="#" onClick={this._handleAssessmentForm(book)}>
                                  { this._assessmentFromBook(book).length > 0 ? 'Editar Test' : 'Crear Test'}
                                </a>
                            },
                          ]}
                          data={orgBooks}
                        />
                      }
                    />
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={6}>
                    <RegularCard
                      headerColor="orange"
                      cardTitle="Clazbooks"
                      cardSubtitle="Libros que ha publicado Clazbooks."
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
                              Header: 'Examen ⇵',
                              id: 'assessment',
                              accessor: book =>
                                book.assessment ? 'Sí' : 'No',
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
                              accessor: book =>
                                <a href="#" onClick={this._handleAssessmentForm(book)}>
                                  { book.assessment ? 'Editar Test' : 'Crear Test'}
                                </a>
                            },
                          ]}
                          data={clazBooks}
                        />
                      }
                    />
                  </ItemGrid>
                </Grid>
                <Dialog
                  open={openFormModal}
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
                         disabled
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
              </div>
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default New;
