import React from 'react';
import { Grid } from 'material-ui';
import { Link } from 'react-router-dom';

// import client from '../../utils/client.js';
import axios from 'axios';
import URLS from '../../constants/urls.js';
import { getAccessToken } from '../../utils/session.js';

import { RegularCard, ItemGrid } from 'components';
import ReactTable from 'react-table';

class Users extends React.Component {
  state = {
    status: 'loading',
  };

  componentWillMount() {
    axios
      .get(URLS.USERS, { headers: { Authorization: getAccessToken() } })
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
    const { status, users } = this.state;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          {users ? (
            <RegularCard
              cardTitle="Usuarios"
              cardSubtitle="Estos son los usuarios de tu organización."
              content={
                <ReactTable
                  filterable
                  columns={[
                    {
                      Header: 'Nombre',
                      accessor: 'name',
                      id: 'name',
                    },
                    {
                      Header: 'Email',
                      accessor: 'email',
                      id: 'email',
                    },
                    {
                      Header: 'Tiempo Total Activo',
                      accessor: 'total_time_active',
                      id: 'total_time_active',
                    },
                    {
                      Header: 'Libro más escuchado',
                      id: 'most_played',
                      filterable: false,
                      accessor: user => user.most_played[0],
                    },
                    {
                      Header: 'Libro más leído',
                      id: 'most_read',
                      filterable: false,
                      accessor: user => user.most_read[0],
                    },
                    {
                      Header: 'Opciones',
                      id: 'options',
                      filterable: false,
                      accessor: user => (
                        <Link to={`/users/${user.id}`}>Ver</Link>
                      ),
                    },
                  ]}
                  data={users}
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

export default Users;
