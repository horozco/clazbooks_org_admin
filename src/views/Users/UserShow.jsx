import React from "react";
import { Grid } from "material-ui";
import { Link } from "react-router-dom";

import { RegularCard, ItemGrid, Button, Table } from "components";

import {
  Avatar,
  List,
  ListItem,
  ListItemText
} from "material-ui";

import {
  Email,
  DateRange,
  Favorite,
  Smartphone,
  AccessTime
} from '@material-ui/icons';

function UserShow({ ...props }) {
  const BackLink = props => <Link to={`/users`} {...props} />;

  return (
    <RegularCard
      cardTitle="Nombre del usuario"
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
                  <ListItemText primary="Email" secondary="hkiller@gmail.com" />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <DateRange />
                  </Avatar>
                  <ListItemText primary="Fecha de Ingreso" secondary="July 20, 2014" />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <DateRange />
                  </Avatar>
                  <ListItemText primary="Último inicio de sesión" secondary="July 20, 2014" />
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
                  <ListItemText primary="Número de favoritos" secondary="28" />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <Smartphone />
                  </Avatar>
                  <ListItemText primary="Sistema Operativo" secondary="iOs" />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <AccessTime />
                  </Avatar>
                  <ListItemText primary="Tiempo Total Activo" secondary="10 días" />
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
                    tableHead={["Nombre", "Cantidad de veces escuchado"]}
                    tableData={[
                      ["Dakota Rice", "3",],
                      ["Minerva Hooper", "3"],
                      ["Sage Rodriguez", "3"],
                      ["Philip Chaney", "3"]
                    ]}
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
                    tableHead={["Nombre", "Cantidad de veces escuchado"]}
                    tableData={[
                      ["Dakota Rice", "3",],
                      ["Minerva Hooper", "3"],
                      ["Sage Rodriguez", "3"],
                      ["Philip Chaney", "3"]
                    ]}
                  />
                }
              />
            </ItemGrid>
          </Grid>
          <br />
          <br />
          <Button color="primary" component={BackLink}>
            Regresar
          </Button>
        </div>
      }
    />
  );
}

export default UserShow;
