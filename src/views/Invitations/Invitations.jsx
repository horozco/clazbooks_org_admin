import React from 'react';
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  IconButton,
} from 'material-ui';
import { Link } from 'react-router-dom';

import client from '../../utils/client';
import URLS from '../../constants/urls.js';
import { getAccessToken } from '../../utils/session.js';

import { RegularCard, ItemGrid, Button } from 'components';
import ReactTable from 'react-table';

import SendIcon from '@material-ui/icons/Send';
import Cancel from '@material-ui/icons/Cancel';
import Close from '@material-ui/icons/Close';
import './invitation.css';

class Invitations extends React.Component {
  state = {
    status: 'loading',
    message: '',
    emails: '',
    openSendModal: false,
    showMessage: false,
  };

  componentDidMount() {
    this._getAllInvitations();
  }

  _getAllInvitations = () => {
    return client
      .get(URLS.INVITATIONS)
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

  _revokeToken = id => {
    if (
      window.confirm(
        '¿Está seguro que desea revocar esta invitación? Un nuevo código se va a generar con el tiempo restante para ser enviado manualmente.'
      )
    ) {
      client
        .delete(`${URLS.INVITATIONS}/${id}`)
        .then(({ data }) => {
          this.setState({
            showMessage: true,
            message: 'Se ha revokado esta invitación.',
            invitations: this.state.invitations.map(
              invitation =>
                invitation.id === data.invitation.id
                  ? { ...data.invitation }
                  : { ...invitation }
            ),
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

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  _handleClickSend = () => {
    this.setState({ openSendModal: true });
  };

  _handleClose = () => {
    this.setState({ openSendModal: false });
  };

  _handleChange = emails => event => {
    this.setState({
      emails: event.target.value,
    });
  };

  _handleSubmit = () => {
    var message = undefined;
    client
      .post(URLS.INVITATIONS, { emails: this.state.emails })
      .then(({ data }) => {
        if (data.errors.length >= 1) {
          message = data.errors
            .map(error => {
              return error.email[0];
            })
            .join('-');
        }
        this._getAllInvitations();
        this.setState({
          openSendModal: false,
          emails: '',
          showMessage: true,
          message:
            message ||
            'Se han enviado ' + data.invitations.length + ' invitaciones',
        });
      })
      .catch(error => {
        this.setState({
          emails: '',
          showMessage: true,
          message: 'error' + error,
          openSendModal: false,
        });
      });
  };

  render() {
    const {
      status,
      invitations,
      showMessage,
      message,
      openSendModal,
      emails,
    } = this.state;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <React.Fragment>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {invitations ? (
              <RegularCard
                cardTitle="Invitaciones enviadas"
                cardSubtitle="Estas son las invitaciones que has enviado."
                content={
                  <ReactTable
                    filterable
                    columns={[
                      {
                        Header: 'Email',
                        accessor: 'email',
                        id: 'email',
                      },
                      {
                        Header: '¿Aceptada?',
                        id: 'accept',
                        filterable: false,
                        accessor: invitation =>
                          invitation.accepted ? 'Sí' : 'No',
                      },
                      {
                        Header: 'Fecha de activación',
                        accessor: 'accepted_at',
                      },
                      {
                        Header: 'Fecha de envío',
                        accessor: 'sent_at',
                      },
                      {
                        Header: 'Revocado',
                        id: 'revoked',
                        filterable: false,
                        accessor: invitation =>
                          invitation.revoked ? 'Sí' : 'No',
                      },
                      {
                        Header: 'Opciones',
                        id: 'options',
                        filterable: false,
                        accessor: invitation =>
                          invitation.revoked ? null : (
                            <IconButton
                              key="close"
                              aria-label="Close"
                              color="inherit"
                              onClick={() => this._revokeToken(invitation.id)}
                            >
                              <Close />
                            </IconButton>
                          ),
                      },
                    ]}
                    data={invitations}
                  />
                }
              />
            ) : (
              ''
            )}
          </ItemGrid>
          <Button
            onClick={this._handleClickSend}
            variant="fab"
            color="info"
            aria-label="sendInvitation"
            customClasses="floating-button"
            round
          >
            <SendIcon />
          </Button>
        </Grid>
        <Dialog
          open={this.state.openSendModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Enviar Invitaciones</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Digite los correos electrónicos a los cuales desea enviar las
              invitaciones para acceso a la aplicación. Debe separar los correos por
              comas(,)
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
      </React.Fragment>
    );
  }
}

export default Invitations;
