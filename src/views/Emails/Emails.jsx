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
  Send,
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

import { RegularCard, ItemGrid, Button } from "components";

import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

class Emails extends React.Component {
  state = {
    subject: '',
    body: '',
    showMessage: false,
    isSubmitting: false,
  };

  componentDidMount() {
    // this._getAllPosts();
  }

  _handleChange = field => event => {
    this.setState({
      [field]: event.target ? event.target.value : event
    });
  };

  _handleEditorChange = (body) => this.setState({body});

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
      isSubmitting: false,
      showMessage: true,
      subject: '',
      body: '',
      message: message || 'Se ha enviado el mensaje.',
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
        if (this.subject.value) {
          formData.append('email[subject]', this.subject.value);
        }

        if (this.state.body) {
          formData.append("email[body]", this.state.body);
        }

        if (this.subject.value && this.state.body) {
          client.post(URLS.EMAILS, formData)
            .then(({ data }) => {
              this._successSave(data);
            })
            .catch(error => {
              this._handleError(error);
            });
        } else {
          this._handleError('Debe tener un subject y un body.');
        }
      }
    );
  };

  _handleError = errorMessage => {
    this.setState({
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
    });
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  render() {
    const {
      subject,
      body,
      showMessage,
      message,
      isSubmitting,
    } = this.state;

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Enviar emails masivos"
              cardSubtitle="Escribe el título y el contenido del email."
              content={
                <form onSubmit={this._handleSubmit}>
                  <h3> Ingrese la información del email que desea enviar</h3>
                  <TextField
                    autoFocus
                    id="subject"
                    label="Escribe aquí el título del email que deseas enviar"
                    name="subject"
                    inputRef={ref => (this.subject = ref)}
                    onChange={this._handleChange('subject')}
                    value={subject}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <br/>
                  <br/>
                  <ReactQuill value={body} onChange={this._handleEditorChange} />
                  <Button type="submit" disabled={isSubmitting} color="primary">
                    <Send /> Enviar
                  </Button>
                </form>
              }
            />
          </ItemGrid>
        </Grid>

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

Emails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Emails);
