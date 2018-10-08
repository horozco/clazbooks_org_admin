import React from "react";

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
  AddCircleOutline,
  Add,
} from "@material-ui/icons";

import {
  withStyles,
  Snackbar,
  IconButton,
  Grid,
} from "material-ui";

import { SessionConsumer } from "components/Session/SessionContext.jsx";

import { StatsCard, ChartCard, RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';
import { getOrganization } from '../../utils/session.js';

import { Link } from "react-router-dom";
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

import CurrentOrganization from './CurrentOrganization'
import MyOrganizations from './MyOrganizations'
import { isSuperAdmin, managedOrganization } from '../../utils/session.js';

class Organizations extends React.Component {
  state = {
    status: "loading",
    organization: {
      name: '', phone: '', email: '', logo: ''
    },
    message: '',
    organizations: [],
    showMessage: false,
    currentPage: 'currentOrganization',
    isSubmitting: false
  };

  componentDidMount() {
    this.getOrganizationInfo();
    if (isSuperAdmin()) {
      this.getOrganizationsInfo();
    }
  }

  getOrganizationInfo = () => {
    const organization_id = isSuperAdmin() ? managedOrganization() : getOrganization().id
    return client
      .get(`${URLS.ORGANIZATIONS}${organization_id}`)
        .then(({ data: organization }) => {
          this.setState({
            ...organization,
            status: 'success'
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  }

  getOrganizationsInfo = () => {
    return client
      .get(URLS.ORGANIZATIONS)
        .then(({ data: organizations }) => {
          this.setState({
            ...organizations,
            status: 'success'
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  }

  _handlePageChange = pageName => event => {
    this.setState({currentPage: pageName})
  };

  _handleChangeOrganization = (field, value) => {
    this.setState({
      organization:{
        ...this.state.organization,
        [field]: value
      },
    });
  };

  _handleUpdateCurrentOrg = () => event => {
    event.preventDefault();
    this.setState({
      isSubmitting: true
    }, () => {
      const data = new FormData();
      if (this.state.organization.name) {
        data.append("organization[name]", this.state.organization.name);
      }
      if (this.state.organization.email) {
        data.append("organization[email]", this.state.organization.email);
      }
      if (this.state.organization.phone) {
        data.append("organization[phone]", this.state.organization.phone);
      }
      // if (this.state.organization.logo) {
      //   data.append("organization[logo]", this.state.logo.files[0]);
      // }

      if (this.state.organization.name || this.state.organization.logo) {
        client
          .put(`${URLS.ORGANIZATIONS}${this.state.organization.id}`, data)
            .then((response) => {
              this.setState({
                success: true,
                isSubmitting: false,
                showMessage: true,
                message: 'Se ha actualizado correctamente la organización.'
              })
            })
      }else{
        this.setState({
          success: true,
          isSubmitting: false,
          showMessage: true,
          message: 'No se han realizado cambios'
        })
      }
    })
  };

  render() {
    const {
      status,
      showMessage,
      message,
      organization,
      organizations,
      isSubmitting,
      currentPage,
    } = this.state;

    const currentOrganizationId = getOrganization().id;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <SessionConsumer>
        {
          session => (
            <div>
              <Grid container>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={Done}
                    iconColor="red"
                    title="Mi Organización"
                    description={'-'}
                    small=""
                    statIcon={Done}
                    statIconColor="danger"
                    statText="Información general de tu organización."
                    onClick={this._handlePageChange('currentOrganization')}
                    selected={currentPage==='currentOrganization'}
                  />
                </ItemGrid>
                {
                  organizations.length >= 1 ?
                    (
                      <React.Fragment>
                        <ItemGrid xs={12} sm={6} md={4}>
                          <StatsCard
                            icon={DoneAll}
                            iconColor="orange"
                            title="Mis Organizaciones"
                            description={'-'}
                            statIcon={DoneAll}
                            statText="Administra tus organizaciones."
                            onClick={this._handlePageChange('myOrganizations')}
                            selected={currentPage==='myOrganizations'}
                          />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={4}>
                          <StatsCard
                            icon={Web}
                            iconColor="green"
                            title="Crear organizaciones"
                            description={'-'}
                            statIcon={Web}
                            statText="Crea nuevas organizaciones."
                            onClick={this._handlePageChange('createOrganization')}
                            selected={currentPage==='createOrganization'}
                          />
                        </ItemGrid>
                      </React.Fragment>
                    ) : null
                }
              </Grid>

              { currentPage === 'currentOrganization' ? (
                  <CurrentOrganization
                    organization={organization}
                    updateOrg={this._handleUpdateCurrentOrg}
                    isSubmitting={isSubmitting}
                    changeOrganization={this._handleChangeOrganization}
                  />
                ) : null
              }
              { currentPage === 'myOrganizations' ? (
                  <MyOrganizations
                    organizations={organizations}
                  />
                ) : null
              }
              { currentPage === 'createOrganization' ? <h1>Pronto pordrás crear organizaciones.</h1> : null }

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
          )
        }
      </SessionConsumer>
    );
  }
}

export default withStyles(dashboardStyle)(Organizations);
