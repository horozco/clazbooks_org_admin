import React from 'react';
import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, IconButton } from 'material-ui';
import { Link } from 'react-router-dom';

import axios from "axios";
import URLS from '../../constants/urls.js';
import { getAccessToken } from '../../utils/session.js';

import { RegularCard, Table, ItemGrid, Button } from 'components';

import SendIcon from '@material-ui/icons/Send';
import Cancel from '@material-ui/icons/Cancel';
import Close from '@material-ui/icons/Close';
import "./invitation.css"

class Invitations extends React.Component {
  state = {
    status: "loading",
    message: "",
    emails: "",
    openSendModal: false,
    showMessage: false
  }

  componentWillMount() {
    this._getAllInvitations();
  }

  _getAllInvitations = () => {
    axios
      .get(URLS.INVITATIONS, { headers: { Authorization: getAccessToken() } })
        .then(({ data }) => {
          this.setState({
            ...data,
            status: "success"
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  }

  _handleErrorMessageClose = () => {
    this.setState({showMessage: false, message: ''})
  }

  _handleClickSend = () => {
    this.setState({openSendModal: true});
  }

  _handleClose = () => {
    this.setState({openSendModal: false});
  }

  _handleChange = emails => event => {
    this.setState({
      emails: event.target.value
    });
  }

  _handleSubmit = () => {
    // horozco15+1@gmail.com,horozco15+2@gmail.com,horozco15+3@gmail.com
    const headers = {
      headers: {
        Authorization: getAccessToken()
      }
    };
    var message = undefined
    axios
      .post(URLS.INVITATIONS, { emails: this.state.emails }, headers )
        .then(({data}) => {
          if (data.errors.length > 1) {
            message = data.errors.map((error) => { return error.email[0] }).join('-');
          }
          this._getAllInvitations();
          this.setState({
            openSendModal: false,
            emails: "",
            showMessage: true,
            message: message || 'Se han enviado ' +  data.invitations.length + ' invitaciones'
          })
        })
        .catch((error) => {
          this.setState({
            emails: "",
            showMessage: true,
            message: "error" + error,
            openSendModal: false
          });
        });
  }

  render() {
    const {
      status,
      invitations,
      showMessage,
      message,
      openSendModal,
      emails
    } = this.state;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <React.Fragment>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {
              invitations ? (
                <RegularCard
                  cardTitle='Invitaciones enviadas'
                  cardSubtitle='Estas son las invitaciones que has enviado.'
                  content={
                    <Table
                      tableHeaderColor='primary'
                      tableHead={['#', 'Email', 'Código', '¿Aceptado?', 'Email Utilizado', 'Fecha de activación', 'Fecha de envío']}
                      tableData={invitations.map((invitation, index)=>{
                        return [index + 1, invitation.email, invitation.code, invitation.accepted ? 'Sí' : 'No', invitation.email_accepted, invitation.accepted_at, invitation.sent_at]
                      })}
                    />
                  }
                />
              ) : ''
            }
          </ItemGrid>
          <Button onClick={this._handleClickSend} variant="fab" color="info" aria-label="sendInvitation" customClasses="floating-button" round>
            <SendIcon />
          </Button>
        </Grid>
        <Dialog
          open={this.state.openSendModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Enviar Códigos</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Digite los correos electrónicos a los cuales desea enviar los códigos de acceso de la aplicación. Debe separar los correos por comas(,)
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              onChange={this._handleChange()}
              value={this.state.emails}
              label="Correos electrónicos"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this._handleClose} color="primary">
              <Cancel /> Cancelar
            </Button>
            <Button onClick={this._handleSubmit} color="info">
              <SendIcon /> Enviar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'left'}}
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
    )
  }
}

export default Invitations;
