import React from 'react';
import { Grid } from 'material-ui';
import { Link } from 'react-router-dom';

// import client from '../../utils/client.js';
import axios from 'axios';
import { getAccessToken } from '../../utils/session.js';
import URLS from '../../constants/urls.js';

import { RegularCard, ItemGrid } from 'components';
import ReactTable from 'react-table';

class Codes extends React.Component {
  state = {
    status: 'loading',
  };

  componentWillMount() {
    axios
      .get(URLS.CODES, { headers: { Authorization: getAccessToken() } })
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
  }

  render() {
    const { codes, status } = this.state;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          {codes ? (
            <RegularCard
              cardTitle="Códigos de Usuario"
              cardSubtitle="Estos son sus códigos de usuarios"
              content={
                <ReactTable
                  filterable
                  columns={[
                    {
                      Header: 'Código',
                      accessor: 'content',
                      id: 'content',
                    },
                    {
                      Header: 'Duración',
                      accessor: 'duration',
                      id: 'duration',
                    },
                    {
                      Header: 'Activado',
                      filterable: false,
                      accessor: 'used',
                      id: 'used',
                    },
                    {
                      Header: 'Fecha de inicio',
                      accessor: 'start_date',
                      id: 'start_date',
                    },
                    {
                      Header: 'Fecha de Caducidad',
                      accessor: 'end_date',
                      id: 'end_date',
                    },
                    {
                      Header: 'Revocado',
                      id: 'revoked',
                      filterable: false,
                      accessor: code => (code.revoked ? 'Sí' : 'No'),
                    },
                    {
                      Header: 'Para enviar',
                      id: 'available_for_invitation',
                      filterable: false,
                      accessor: code => (code.available_for_invitation ? 'Sí' : 'No'),
                    },
                  ]}
                  data={codes}
                />
              }
            />
          ) : (
            ''
          )}
        </ItemGrid>
      </Grid>
    );
  }
}

export default Codes;
