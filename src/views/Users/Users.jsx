import React from 'react';
import { Grid } from 'material-ui';
import { Link } from 'react-router-dom';

import { RegularCard, Table, ItemGrid } from 'components';

function Users({ ...props }) {
  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle='Usuarios'
          cardSubtitle='Estos son los usuarios de tu organización.'
          content={
            <Table
              tableHeaderColor='primary'
              tableHead={['Nombre', 'Email', 'Tiempo Total Activo', 'Libro más escuchado', 'Libro más leído', 'Opciones']}
              tableData={[
                ['Dakota Rice', 'dakota@mail.com', '3 días', 'Steve Jobs', 'Concéntrate', <Link to={`/users/1`}>Ver</Link>],
                ['Minerva Hooper', 'Curaçao@mail.com', '2 Meses', 'Steve Jobs', 'Concéntrate', <Link to={`/users/1`}>Ver</Link>],
                ['Sage Rodriguez', 'Netherlands@mail.com', '1 Minuto', 'Steve Jobs', 'Concéntrate', <Link to={`/users/1`}>Ver</Link>],
                ['Philip Chaney', 'Korea@mail.com', '19 Minutos', 'Steve Jobs', 'Concéntrate', <Link to={`/users/1`}>Ver</Link>],
                ['Doris Greene', 'Malawi@mail.com', 'Alrededor de 2 horas', 'Steve Jobs', 'Concéntrate', <Link to={`/users/1`}>Ver</Link>],
                ['Mason Porter', 'Chile@mail.com', '40 minutos', 'Steve Jobs', 'Concéntrate', <Link to={`/users/1`}>Ver</Link>]
              ]}
            />
          }
        />
      </ItemGrid>
    </Grid>
  );
}

export default Users;
