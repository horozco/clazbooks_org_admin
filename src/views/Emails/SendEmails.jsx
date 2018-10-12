import React from "react";
import PropTypes from "prop-types";

import {
  Save,
  Cancel,
  Close,
  Send,
} from "@material-ui/icons";

import {
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

import { RegularCard, ItemGrid, Button } from "components";

import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

class SendEmails extends React.Component {
  state = {
    subject: '',
    body: '',
    showMessage: false,
    isSubmitting: false,
    contactLists: this.props.contactLists || [],
    selectedContactLists: [],
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
      selectedContactLists: [],
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
          formData.append('massive_email[subject]', this.subject.value);
        }

        if (this.state.body) {
          formData.append("massive_email[body]", this.state.body);
        }

        if (this.state.body) {
          formData.append("massive_email[contact_lists_ids]", this.state.selectedContactLists);
        }

        if (this.subject.value && this.state.body) {
          client.post(URLS.MASSIVE_EMAILS, formData)
            .then(({ data }) => {
              this._successSave(data);
            })
            .catch(error => {
              this._handleError(error.response.data.errors);
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
      selectedContactLists
    } = this.state;

    const {
      contactLists,
    } = this.props;

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Seleccione una lista de destinatarios"
              cardSubtitle="Escribe el título y el contenido del email."
              content={
                <form onSubmit={this._handleSubmit}>
                  <FormControl style={{minWidth: '290px'}}>
                   <InputLabel htmlFor="age-simple">Lista de destinatarios</InputLabel>
                   <Select
                     multiple
                     name='users'
                     value={selectedContactLists}
                     onChange={this._handleChange('selectedContactLists')}
                     inputProps={{
                       name: 'contactEmails',
                       id: 'contactEmails',
                     }}
                   >
                     {
                      this.props.contactLists.map((contact, key) =>
                        <MenuItem value={contact.id} key={key}>{contact.name}</MenuItem>
                      )
                     }
                   </Select>
                  </FormControl>
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
    );
  }
}

export default SendEmails;
