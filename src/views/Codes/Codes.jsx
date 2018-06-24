import React from 'react';
import { Grid } from 'material-ui';
import { Link } from 'react-router-dom';

// import client from '../../utils/client.js';
import axios from "axios";
import { getAccessToken } from '../../utils/session.js';
import URLS from '../../constants/urls.js';

import { RegularCard, Table, ItemGrid } from 'components';

class Codes extends React.Component {
  state = {
    status: "loading"
  }

  componentWillMount() {
    axios
      .get(URLS.CODES, { headers: { Authorization: getAccessToken() } })
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

  render() {
    const {
      codes,
      status
    } = this.state;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          {
            codes ? (
              <RegularCard
                cardTitle='Códigos de Usuario'
                cardSubtitle='Estos son sus códigos de usuarios'
                content={
                  <Table
                    tableHeaderColor='primary'
                    tableHead={['#', 'Código', 'Duración', 'Activado', 'Fecha de inicio', 'Fecha de Caducidad']}
                    tableData={codes.map((code, index)=>{
                      return [index, code.content, code.duration, code.used, code.start_date, code.end_date]
                    })}
                  />
                }
              />
            ) : ''
          }
        </ItemGrid>
      </Grid>
    )
  }
}

export default Codes;
