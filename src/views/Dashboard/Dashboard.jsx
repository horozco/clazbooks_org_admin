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

import { StatsCard, ChartCard, RegularCard, Table, ItemGrid } from "components";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import { Link } from "react-router-dom";
// import client from "../../utils/client.js";
import axios from "axios";
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
    axios
      .get(URLS.DASHBOARD, { headers: { Authorization: getAccessToken() } })
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
              title="Códigos Generados"
              description={codes_generated}
              small=""
              statIcon={Fingerprint}
              statIconColor="danger"
              statText="Códigos que se han generado."
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={DoneAll}
              iconColor="orange"
              title="Códigos Usados"
              description={codes_used}
              statIcon={DoneAll}
              statText="Códigos usados por usuarios."
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <StatsCard
              icon={Done}
              iconColor="green"
              title="Códigos Disponibles"
              description={codes_remaining}
              statIcon={Done}
              statText="Códigos disponibles para generar."
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {top_user_actives ? (
              <RegularCard
                headerColor="blue"
                cardTitle="Usuarios Activos"
                cardSubtitle="Usuarios que pertenecen a su organización."
                content={
                  <Table
                    tableHeaderColor="warning"
                    tableHead={[
                      "#",
                      "Nombre",
                      "Email",
                      "Tiempo Activo",
                      "Más escuchado",
                      "Más Leído",
                      "Acciones"
                    ]}
                    tableData={top_user_actives.map(({user}, index) => {
                      return [
                        index,
                        user.name,
                        user.email,
                        user.total_time_active,
                        user.most_played[0],
                        user.most_read[0],
                        <Link to={`/users/${user.id}`}>Ver</Link>
                      ];
                    })}
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
