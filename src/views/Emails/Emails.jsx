import React from "react";

import {
  Done,
  DoneAll,
  Web,
  Save,
  Cancel,
  Close,
  Send,
  ContactMail,
  ViewList,
  History
} from "@material-ui/icons";

import {
  withStyles,
  Snackbar,
  IconButton,
  Grid,
} from "material-ui";

import { StatsCard, ChartCard, RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';

import { Link } from "react-router-dom";
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

import SendEmails from './SendEmails'
import Contacts from './Contacts'
import Lists from './Lists'
import Stats from './Stats'

class Emails extends React.Component {
  state = {
    status: 'loading',
    currentPage: 'send',
    isSubmitting: false,
    showMessage: false,
    message: '',
    users: [],
    contacts: [],
    contact_lists: []
  };

  componentDidMount() {
    this._getAllUsers();
    this._getAllContacts();
    this._getAllLists();
  };

  _getAllUsers = () => {
    client
      .get(URLS.USERS)
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

  _getAllContacts = (cb) => {
    client
      .get(URLS.CONTACTS)
      .then(({ data }) => {
        this.setState({
          ...data,
          status: 'success',
        });
        if (cb) {
          cb(data);
        }
      })
      .catch(() => {
        this.setState({
          status: 'error',
        });
      });
  };

  _getAllLists = (cb) => {
    client
      .get(URLS.CONTACT_LISTS)
      .then(({ data }) => {
        this.setState({
          ...data,
          status: 'success',
        });
        if (cb) {
          cb(data);
        }
      })
      .catch(() => {
        this.setState({
          status: 'error',
        });
      });
  };

  _handlePageChange = pageName => event => {
    this.setState({currentPage: pageName})
  };

  _hanldeShowMessage = (message) => {
    this.setState({
      showMessage: true,
      message: message
    })
  };

  _handleMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
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
      currentPage,
      isSubmitting,
      showMessage,
      message,
      users,
      contacts,
      contact_lists,
    } = this.state;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Send}
              iconColor="green"
              title="Enviar"
              description={'-'}
              small=""
              statIcon={Send}
              statText="Enviar emails masivos."
              onClick={this._handlePageChange('send')}
              selected={currentPage==='send'}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={ContactMail}
              iconColor="orange"
              title="Contactos"
              description={'-'}
              statIcon={ContactMail}
              statText="Gestionar destinatarios."
              onClick={this._handlePageChange('contacts')}
              selected={currentPage==='contacts'}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={ViewList}
              iconColor="red"
              title="Listas"
              description={'-'}
              statIcon={ViewList}
              statText="Gestionar listas."
              onClick={this._handlePageChange('lists')}
              selected={currentPage==='lists'}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={History}
              iconColor="blue"
              title="Enviados"
              description={'-'}
              statIcon={History}
              statText="Estadísticas de emails."
              onClick={this._handlePageChange('stats')}
              selected={currentPage==='stats'}
            />
          </ItemGrid>
        </Grid>

        {
          currentPage === 'send' ?
          <SendEmails
            setMessage={this._hanldeShowMessage}
            contactLists={contact_lists}
          />
          : null
        }
        {
          currentPage === 'contacts' ?
          <Contacts
            setMessage={this._hanldeShowMessage}
            users={users}
            contacts={contacts}
            getAllContacts={this._getAllContacts}
            filterCaseInsensitive={this._filterCaseInsensitive}
          />
          : null
        }
        {
          currentPage === 'lists' ?
          <Lists
            setMessage={this._hanldeShowMessage}
            users={users}
            contacts={contacts}
            contactLists={contact_lists}
            getAllLists={this._getAllLists}
            getAllContacts={this._getAllContacts}
            filterCaseInsensitive={this._filterCaseInsensitive}
          />
          : null
        }
        {
          currentPage === 'stats' ?
          <Stats
            setMessage={this._hanldeShowMessage}
            filterCaseInsensitive={this._filterCaseInsensitive}
          />
          : null
        }

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={showMessage}
          onClose={this._handleMessageClose}
          message={<span>{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this._handleMessageClose}
            >
              <Close />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Emails);
