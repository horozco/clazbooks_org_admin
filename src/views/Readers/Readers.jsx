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
    mdContent: "# Frase principal del libro - Texto grande nivel 1\r\n\r\n---\r\n(separador)\r\n\r\nEsto es un párrafo normal. texto normal __que puede__ _tener_ multiples <u>formatos</u>.\r\n\r\nTexto normal __que puede__ _tener_ multiples <u>formatos</u>. Texto normal __que puede__ _tener_ multiples <u>formatos</u>\r\n\r\n## Bloque de texto más grande de nivel 2 que puede tener la cantidad deseada de texto pero que no puede contener saltos de línea, si hacemos un salto de línea, ya pierde el formato.\r\n\r\n### Bloque de texto más grande de nivel 3 que puede tener la cantidad deseada de texto pero que no puede contener saltos de línea, si hacemos un salto de línea, ya pierde el formato.\r\n\r\n#### Bloque de texto más grande de nivel 4 que puede tener la cantidad deseada de texto pero que no puede contener saltos de línea, si hacemos un salto de línea, ya pierde el formato.\r\n\r\n__Más texto__ is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\r\n\r\n---\r\n\r\n1. Item 1\r\n2. Item 2\r\n3. Item 3 \r\n\r\n---\r\n\r\n* Item 1\r\n* Item 2\r\n* Item 3 \r\n\r\n> Frases con números __romanos__\r\n\r\n---\r\n\r\n> Frases con números romanos\r\n\r\n> Frases con números romanos\r\n\r\n> Frases con números romanos\r\n\r\nMás texto se puede colocar aquí.",
    images: '',
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
        ? `${URLS.READERS}${this.state.currentContent.id}`
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
            cardTitle="Contenido"
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
