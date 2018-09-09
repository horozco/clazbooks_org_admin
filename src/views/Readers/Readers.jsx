import React from "react";
import { Grid, TextField, Button } from "material-ui";
import { Snackbar, IconButton } from "material-ui";
import { Link } from 'react-router-dom';
import { RegularCard, ItemGrid, Table } from "components";

import { getAccessToken } from '../../utils/session.js';

import CloseIcon from '@material-ui/icons/Close';

import client from "../../utils/client.js";
import URLS from "../../constants/urls.js";

import SimpleMDE from 'react-simplemde-editor';
import "simplemde/dist/simplemde.min.css";

class Readers extends React.Component {
  state = {
    status: 'loading',
    success: false,
    mdContent: "# Escribe aqui la frase incial\r\n\r\n---\r\n(estos tres guiones representan un separador, puedes colocar tantos como desees)\r\n\r\nEsto es un párrafo normal. texto normal __que puede__ _tener_ multiples <u>formatos</u>.\r\nTexto normal __que puede__ _tener_ multiples <u>formatos</u>. Texto normal __que puede__ _tener_ multiples <u>formatos</u>\r\n\r\n1. También\r\n2. Puedes Hacer\r\n3. Numeración\r\n\r\n> El texto que se muestra después de este símbolo\r\n> Será mostrado como números romanos\r\n> Se puede utilizar para hacer quotes\r\n\r\nPues escribir mas texto __aquí__ \r\n\r\nsi necesitas un link solo abre corchetes y luego paréntesis, así:\r\n\r\n[Texto link](http://google.com)\r\n\r\nEn los corchetes va el texto del link, en los paréntesis va el link\r\n",
    images: '',
    currentContent: {},
    isSubmitting: false,
    showMessage: false,
    message: '',
  };

  componentWillMount() {
    return client
      .get(`${URLS.READERS}${this.props.match.params.id}?from_book=true`)
      .then(({ data }) => {
        this.setState({
          currentContent: data.new_reader,
          mdContent: data.new_reader.md_content,
          images: data.new_reader.new_reader_images,
          status: 'success',
        });
      })
      .catch(() => {
        this.setState({
          status: 'error',
        });
      });
  }

  _goBack = e => {
    e.preventDefault();
    this.props.history.goBack();
  };

  _handleSubmit = () => event => {
    event.preventDefault();
    this.setState({
      isSubmitting: true
    }, () => {
      const formData = new FormData();

      if (this.md_content.value) {
        formData.append("new_reader[md_content]", this.md_content.value);
      }

      if (this.images.value) {
        formData.append("new_reader[new_reader_images_attributes][0][image]", this.images.files[0]);
      }

      formData.append("book_id", this.props.match.params.id);

      const method = this.state.currentContent.id ? 'put' : 'post';
      const url = this.state.currentContent.id
        ? `${URLS.READERS}${this.state.currentContent.book_id}`
        : URLS.READERS;

      client[method](url, formData)
        .then(({ data }) => {
          this._successSave(data);
        })
        .catch(error => {
          this._handleError(error);
        });
    })
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
    this.setState({
      images: '',
      currentContent: data.new_reader,
      mdContent: data.new_reader.md_content,
      isSubmitting: false,
      showMessage: true,
      message: message || 'Se ha guardado el contenido para el libro.',
    });
  };

  _handleError = errorMessage => {
    this.setState({
      images: '',
      mdContent: '',
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
    });
  };


  _handleChange = field => value => {
    this.setState({
      [field]: value
    });
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  BackLink = props => <Link to={`/books`} {...props} onClick={this._goBack} />;

  render() {

    const {
      status,
      images,
      mdContent,
      isSubmitting,
      showMessage,
      currentContent,
      message,
    } = this.state;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            cardTitle={`Contenido para ${currentContent.book.name}`}
            content={
              <div>
                <Grid container>
                  <ItemGrid xs={12} sm={12} md={12}>
                    <form onSubmit={this._handleSubmit()}>
                      <SimpleMDE
                        ref={el => (this.md_content = el)}
                        name='md_content'
                        value={mdContent}
                        onChange={this._handleChange('mdContent')}
                      />

                      <label>Images</label>
                      <br />
                      <input
                        ref={el => (this.images = el)}
                        accept="image/*"
                        id="raised-button-file"
                        multiple
                        type="file"
                      />
                      <br />
                      <br />
                      <Button type="submit" disabled={isSubmitting} color="primary">
                        Guardar
                      </Button>
                      <Button color="primary" component={this.BackLink}>
                        Regresar
                      </Button>
                    </form>
                  </ItemGrid>
                </Grid>
                <br />
              </div>
            }
          />
        </ItemGrid>
        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'left'}}
          open={showMessage}
          onClose={this._handleErrorMessageClose}
          message={<span>{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this._handleErrorMessageClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Grid>
    );
  }
}

export default Readers;
