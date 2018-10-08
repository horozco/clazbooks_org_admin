import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import {
  Done,
  DoneAll,
  Fingerprint,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility
} from "@material-ui/icons";
import { withStyles, Grid } from "material-ui";

import { StatsCard, ChartCard, RegularCard, ItemGrid } from "components";
import ReactTable from 'react-table';

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import { Link } from "react-router-dom";
// import client from "../../utils/client.js";
import client from '../../utils/client';
import { getAccessToken } from '../../utils/session.js';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    value: 0,
    status: "loading",
    total_codes: 0,
    codes_generated: 0,
    codes_used: 0,
    codes_remaining: 0,
    top_user_actives: []
  };

  componentDidMount() {
    client
      .get(URLS.DASHBOARD)
        .then(({ data: { organization_dashboard } }) => {
          this.setState({
            ...organization_dashboard,
            status: "success"
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
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
      codes_generated,
      codes_used,
      codes_remaining,
      top_user_actives
    } = this.state;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Fingerprint}
              iconColor="red"
              title="Invitaciones Enviadas"
              description={codes_generated}
              small=""
              statIcon={Fingerprint}
              statIconColor="danger"
              statText="Número de invitaciones enviadas."
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={DoneAll}
              iconColor="orange"
              title="Invitaciones Activadas"
              description={codes_used}
              statIcon={DoneAll}
              statText="Número de invitaciones activadas."
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Done}
              iconColor="green"
              title="Invitaciones Disponibles"
              description={codes_remaining}
              statIcon={Done}
              statText="Número de invitaciones disponibles."
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {top_user_actives ? (
              <RegularCard
                headerColor="blue"
                cardTitle="Usuarios Activos"
                cardSubtitle="lista e información de usuarios."
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
                        Header: 'Nombre ⇵',
                        id: 'name',
                        accessor: 'name',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Email ⇵',
                        id: 'email',
                        accessor: 'email',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Tiempo Activo ⇵',
                        id: 'total_time_active',
                        accessor: 'total_time_active',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Más escuchado ⇵',
                        id: 'most_played',
                        accessor: 'most_played[0]',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Más Leído ⇵',
                        id: 'most_read',
                        accessor: 'most_read[0]',
                        Filter: ({ filter, onChange }) =>
                          <input
                            onChange={event => onChange(event.target.value)}
                            style={{ width: '100%' }}
                            placeholder='Buscar'
                          />
                      },
                      {
                        Header: 'Más información',
                        id: 'options',
                        filterable: false,
                        sortable: false,
                        accessor: user =>
                          <Link to={`/users/${user.id}`}>Ver más</Link>
                      },
                    ]}
                    data={top_user_actives.map(u => u.user)}
                  />
                }
              />
            ) : (
              ""
            )}
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
