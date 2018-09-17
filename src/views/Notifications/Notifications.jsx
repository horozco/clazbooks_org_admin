import React from "react";
import PropTypes from "prop-types";

import {
  Done,
  PhoneIphone,
  Android,
  Save,
  Cancel,
  Close,
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
} from "material-ui";

import { StatsCard, ChartCard, RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';

import client from '../../utils/client';
import URLS from "../../constants/urls.js";
import { getOrganization } from '../../utils/session.js';

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Notifications extends React.Component {
  state = {
    status: "loading",
    currentNotification: { id: null, title: '', message: '' },
    notifications_sent: 0,
    android_sent: 0,
    ios_sent: 0,
    push_notifications: [],
    openFormModal: false,
    showMessage: false,
    editForm: false,
    isSubmitting: false,
  };

  componentDidMount() {
    this._getAllNotifications();
  }

  osStats = (push_notifications, osType) => {
    return push_notifications.map(
      (notification) => notification[`${osType}_stats`] && notification[`${osType}_stats`].successful
    ).reduce((stat1, stat2) => stat1 + stat2)
  }

  _getAllNotifications = () => {
    return client
      .get(URLS.NOTIFICATIONS)
        .then(({ data: push_notifications }) => {

          this.setState({
            ...push_notifications,
            ...{notifications_sent: push_notifications.push_notifications.length},
            ...{android_sent: this.osStats(push_notifications.push_notifications, 'android')},
            ...{ios_sent: this.osStats(push_notifications.push_notifications, 'ios')},
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

  _handleAddNewNotification = () => {
    this.setState({ openFormModal: true });
  };

  _handleClose = () => {
    this.setState({
      openFormModal: false,
      currentNotification: { id: null, title: '', message: '' },
      editForm: false,
    });
  };

  _handleChange = field => event => {
    this.setState({
      currentNotification: {
        ...this.state.currentNotification,
        [field]: event.target ? event.target.value : event,
      },
    });
  };

  _successSave = data => {
    var message = '';
    if (data.errors && data.errors.errors.length >= 1) {
      message = data.errors.recipients === 0 ? 'No tiene usuarios subscritos.' : 'Ha ocurrido un error'
    }
    this._getAllNotifications();
    this.setState({
      openFormModal: false,
      currentNotification: { id: null, title: '', message: '' },
      isSubmitting: false,
      showMessage: true,
      editForm: false,
      message: message || 'Se ha guardado el mensaje.',
    });
  };

  _handleSubmit = organizationId => event => {
    event.preventDefault();
    if (
      window.confirm(
        '¿Está seguro que desea enviar esta notifiación a todos los usuarios de su organización?'
      )
    ) {
      this.setState(
        {
          isSubmitting: true,
        },
        () => {
          const formData = new FormData();
          if (this.title.value) {
            formData.append('push_notification[title]', this.title.value);
          }

          if (this.message.value) {
            formData.append("push_notification[message]", this.message.value);
          }

          formData.append("push_notification[organization_id]", organizationId);

          if (this.title.value || this.message.value) {
            client.post(URLS.NOTIFICATIONS, formData)
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
    }
  };

  _handleError = errorMessage => {
    this.setState({
      currentNotification: { id: null, title: '', message: '' },
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
      openFormModal: false,
    });
  };

  _handleShow = notification => event => {
    event.preventDefault();
    this.setState({
      currentNotification: { ...notification },
      openFormModal: true,
      editForm: true,
    });
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  render() {
    const {
      status,
      notifications_sent,
      push_notifications,
      ios_sent,
      android_sent,
      showMessage,
      message,
      openFormModal,
      currentNotification,
      isSubmitting,
      editForm
    } = this.state;

    const currentOrganizationId = getOrganization().id;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Done}
              iconColor="red"
              title="Notificaciones enviadas"
              description={notifications_sent}
              small=""
              statIcon={Done}
              statIconColor="danger"
              statText="Push Notifications enviadas por tu Organización"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={PhoneIphone}
              iconColor="orange"
              title="iOs"
              description={ios_sent}
              statIcon={PhoneIphone}
              statText="Notificaciones recibidas por usuarios iOs"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Android}
              iconColor="green"
              title="Android"
              description={android_sent}
              statIcon={Android}
              statText="Notificaciones recibidas por usuarios Android"
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Push Notifications"
              cardSubtitle="Estas son las notificaciones enviadas por tu organización."
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
                      Header: 'Fecha de envío ⇵',
                      id: 'sent_at',
                      accessor: notification =>
                        new Date(notification.sent_at).toLocaleString(),
                      Filter: ({ filter, onChange }) =>
                        <input
                          onChange={event => onChange(event.target.value)}
                          style={{ width: '100%' }}
                          placeholder='Buscar'
                        />
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
                      Header: 'Contenido ⇵',
                      id: 'message',
                      accessor: 'message',
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
                      accessor: notification =>
                        <a href="#" onClick={this._handleShow(notification)}>
                          Ver
                        </a>
                    },
                  ]}
                  data={push_notifications}
                />
              }
            />
          </ItemGrid>
          <Button
            onClick={this._handleAddNewNotification}
            variant="fab"
            color="info"
            aria-label="sendNotification"
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
          <form onSubmit={this._handleSubmit(currentOrganizationId)}>
            <DialogTitle id="form-dialog-title">
              {this.state.editForm ? 'Notificación enviada' : 'Crear Nueva Notificación'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.editForm ? 'Así se envió esta notificación.' : 'Ingrese la información de la notificación que desea enviar.'}
              </DialogContentText>

              <TextField
                autoFocus
                id="title"
                label="Título"
                name="title"
                inputRef={ref => (this.title = ref)}
                onChange={this._handleChange('title')}
                value={currentNotification.title}
                fullWidth
                margin="normal"
                required
                disabled={currentNotification.id}
              />
              <br/>
              <TextField
                margin="dense"
                id="message"
                name="message"
                inputRef={ref => (this.message = ref)}
                multiline={true}
                onChange={this._handleChange('message')}
                value={currentNotification.message}
                label="Mensaje"
                fullWidth
                required
                disabled={currentNotification.id}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this._handleClose} color="primary">
                <Cancel /> { currentNotification.id ? 'Cerrar' : 'Cancelar' }
              </Button>
              {
                currentNotification.id ? '' :
                <Button type="submit" disabled={isSubmitting} color="primary">
                  <Save /> Guardar
                </Button>
              }
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

Notifications.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Notifications);
