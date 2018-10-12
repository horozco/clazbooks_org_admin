import React from "react";

import {
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
} from "material-ui";

import { RegularCard, ItemGrid, Button, Table} from "components";
import ReactTable from 'react-table';

import client from '../../utils/client';
import URLS from '../../constants/urls.js';

import {
  Visibility,
  Delete,
  Cancel,
  Add,
  Save,
} from "@material-ui/icons";

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

class Stats extends React.Component {
  state = {
    emails: [],
    isSubmitting: false,
    massive_emails: [],
    openShowMassiveEmailModal: false,
    currentMassiveEmail: { body: '', subject: '', emails: '', created_at: '', massive_email_events: []},
  };

  componentDidMount() {
    this._getAllMasiveEmails();
  };

  _getAllMasiveEmails = () => {
    client
      .get(URLS.MASSIVE_EMAILS)
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

  _handleShowMassiveEmail = massiveEmail => evt => {
    evt.preventDefault();
    this.setState({
      currentMassiveEmail: massiveEmail,
      openShowMassiveEmailModal: true,
    })
  };

  _handleCloseModal = (evt) => {
    evt.preventDefault();
    this.setState({
      currentMassiveEmail: { body: '', subject: '', emails: '', created_at: '', massive_email_events: []},
      openShowMassiveEmailModal: false,
    });
  };

  _getAction = action => {
    switch(action) {
      case 'open': {
        return 'Leído';
        break;
      }
      case 'click': {
        return 'Clicks';
        break;
      }
      default: {
        return '-';
        break;
      }
    }
  };


  render() {
    const {
      isSubmitting,
      massive_emails,
      currentMassiveEmail,
      openShowMassiveEmailModal,
    } = this.state;

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              cardTitle="Historial de correos enviados"
              cardSubtitle="Aquí podrás ver detalles del envío de tus correos."
              content={
                <ReactTable
                  filterable
                  defaultFilterMethod={this.props._filterCaseInsensitive}
                  defaultPageSize={10}
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
                      Header: 'Subject ⇵',
                      accessor: 'subject',
                      width: 200,
                      id: 'subject',
                      Filter: ({ filter, onChange }) =>
                        <input
                          onChange={event => onChange(event.target.value)}
                          style={{ width: '100%' }}
                          placeholder='Buscar'
                        />
                    },
                    {
                      Header: '# Emails enviados ⇵',
                      accessor: (stat =>
                        stat.emails.length
                      ),
                      width: 150,
                      id: 'body',
                      Filter: ({ filter, onChange }) =>
                        <input
                          onChange={event => onChange(event.target.value)}
                          style={{ width: '100%' }}
                          placeholder='Buscar'
                        />
                    },
                    {
                      Header: 'Enviado por ⇵',
                      accessor: (stat =>
                        stat.organization_admin.email
                      ),
                      id: 'sent_by',
                      Filter: ({ filter, onChange }) =>
                        <input
                          onChange={event => onChange(event.target.value)}
                          style={{ width: '100%' }}
                          placeholder='Buscar'
                        />
                    },
                    {
                      Header: 'Eventos ⇵',
                      accessor: (stat =>
                        stat.massive_email_events.length
                      ),
                      id: 'events',
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
                      maxWidth: 100,
                      filterable: false,
                      sotable: false,
                      accessor: massive_email => (
                        <React.Fragment>
                          <IconButton href='#' onClick={this._handleShowMassiveEmail(massive_email)}>
                            <Visibility />
                          </IconButton>
                        </React.Fragment>
                      ),
                    },
                  ]}
                  data={massive_emails}
                />
              }
            />
          </ItemGrid>
        </Grid>

        <Dialog
          open={openShowMassiveEmailModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {
              `Subject: ${currentMassiveEmail.subject}`
            }
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>
                {
                  `Remitente: ${'a@b.com'}`//currentMassiveEmail.organization_admin.email}`
                }
              </p>
              <p>
                {
                  `Fecha de envío: ${new Date(currentMassiveEmail.created_at).toLocaleString()}`
                }
              </p>
              <p>
                {
                  `Enviado a: ${currentMassiveEmail.emails.length} correos.`
                }
              </p>
            </DialogContentText>
            <RegularCard
              headerColor="blue"
              cardTitle="Contenido"
              cardSubtitle="Contenido enviado."
              content={
                <ReactQuill value={currentMassiveEmail.body} readOnly={true}/>
              }
            />
            <RegularCard
              headerColor="orange"
              cardTitle="Estadísticas"
              cardSubtitle="Estadísticas del email."
              content={
                <Table
                  tableHeaderColor="info"
                  tableHead={[
                    "#",
                    "Fecha",
                    "Email",
                    "Acción"
                  ]}
                  tableData={currentMassiveEmail.massive_email_events.map((event, index) => {
                    return [
                      index+1,
                      Date(event.created_at).toLocaleString(),
                      event.email,
                      this._getAction(event.event)
                    ]
                  })}
                />
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this._handleCloseModal} color="primary">
              <Cancel /> Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Stats;
