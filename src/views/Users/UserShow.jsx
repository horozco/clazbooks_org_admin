import React from "react";
import { Grid } from "material-ui";
import { Link } from "react-router-dom";

import { RegularCard, ItemGrid, Button, Table } from "components";

import { Avatar, List, ListItem, ListItemText } from "material-ui";

import {
  Email,
  DateRange,
  Favorite,
  Smartphone,
  AccessTime
} from "@material-ui/icons";

import client from "../../utils/client.js";
import URLS from "../../constants/urls.js";

class UserShow extends React.Component {
  state = {};

  componentDidMount() {
    client
      .get(`${URLS.USERS}${this.props.match.params.id}`)
      .then(({ data }) => {
        this.setState({ ...data });
      });
  }

  _goBack = e => {
    e.preventDefault();
    this.props.history.goBack();
  };

  BackLink = props => <Link to={`/users`} {...props} onClick={this._goBack} />;

  render() {
    const { user } = this.state;
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          {user ? (
            <RegularCard
              cardTitle={user.name}
              content={
                <div>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <h5>Información Básica</h5>
                      <List>
                        <ListItem>
                          <Avatar>
                            <Email />
                          </Avatar>
                          <ListItemText
                            primary="Email"
                            secondary={user.email}
                          />
                        </ListItem>
                        <ListItem>
                          <Avatar>
                            <DateRange />
                          </Avatar>
                          <ListItemText
                            primary="Fecha de Ingreso"
                            secondary={user.created_at}
                          />
                        </ListItem>
                        <ListItem>
                          <Avatar>
                            <DateRange />
                          </Avatar>
                          <ListItemText
                            primary="Último inicio de sesión"
                            secondary={user.last_sign_in_at}
                          />
                        </ListItem>
                      </List>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <h5>Estadísticas</h5>
                      <List>
                        <ListItem>
                          <Avatar>
                            <Favorite />
                          </Avatar>
                          <ListItemText
                            primary="Número de favoritos"
                            secondary={user.favorite_amount}
                          />
                        </ListItem>
                        <ListItem>
                          <Avatar>
                            <Smartphone />
                          </Avatar>
                          <ListItemText
                            primary="Sistema Operativo"
                            secondary={user.operative_system}
                          />
                        </ListItem>
                        <ListItem>
                          <Avatar>
                            <AccessTime />
                          </Avatar>
                          <ListItemText
                            primary="Tiempo Total Activo"
                            secondary={user.total_time_active}
                          />
                        </ListItem>
                      </List>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <RegularCard
                        headerColor="orange"
                        cardTitle="Más Escuchados"
                        cardSubtitle="Libros que más ha escuchado este usuario."
                        content={
                          <Table
                            tableHeaderColor="warning"
                            tableHead={[
                              "#",
                              "Nombre"
                            ]}
                            tableData={user.most_played.map((book, index) => {
                              return [index, book]
                            })}
                          />
                        }
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <RegularCard
                        headerColor="orange"
                        cardTitle="Más Leídos"
                        cardSubtitle="Libros que más ha leido este usuario."
                        content={
                          <Table
                            tableHeaderColor="warning"
                            tableHead={[
                              "#",
                              "Nombre"
                            ]}
                            tableData={user.most_read.map((book, index) => {
                              return [index, book]
                            })}
                          />
                        }
                      />
                    </ItemGrid>
                  </Grid>
                  <br />
                  <br />
                  <Button color="primary" component={this.BackLink}>
                    Regresar
                  </Button>
                </div>
              }
            />
          ) : (
            ""
          )}
        </ItemGrid>
      </Grid>
    );
  }
}

export default UserShow;
