import React from 'react';
import { Grid } from 'material-ui';
import { Link } from 'react-router-dom';

import client from '../../utils/client.js';
import URLS from '../../constants/urls.js';

import { RegularCard, Table, ItemGrid } from 'components';

class Users extends React.Component {
  state = {}

  componentWillMount() {
    client.get(URLS.USERS).then( ({data}) => {
      this.setState({...data});
    });
  }

  render() {
    const {
      users
    } = this.state;
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          {
            users ? (
              <RegularCard
                cardTitle='Usuarios'
                cardSubtitle='Estos son los usuarios de tu organización.'
                content={
                  <Table
                    tableHeaderColor='primary'
                    tableHead={['#', 'Nombre', 'Email', 'Tiempo Total Activo', 'Libro más escuchado', 'Libro más leído', 'Opciones']}
                    tableData={users.map((user, index)=>{
                      return [index, user.name, user.email, user.total_time_active, user.most_played[0], user.most_read[0], <Link to={`/users/${user.id}`}>Ver</Link>]
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

export default Users;
