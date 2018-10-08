import React from "react";

import {
  Grid,
} from "material-ui";

import { RegularCard, ItemGrid } from "components";
import ReactTable from 'react-table';
import { Link } from "react-router-dom";

class MyOrganizations extends React.Component {

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
      organizations
    } = this.props;

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            headerColor="blue"
            cardTitle="Mis Organzaciones"
            cardSubtitle="En esta lista, encontrarás la información de tus organizaciones."
            content={
              <ReactTable
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
                    accessor: 'name',
                    id: 'name',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: 'Nombre ⇵',
                    accessor: 'email',
                    id: 'email',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: 'Nombre ⇵',
                    accessor: 'phone',
                    id: 'phone',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                ]}
                data={organizations}
              />
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default MyOrganizations;
