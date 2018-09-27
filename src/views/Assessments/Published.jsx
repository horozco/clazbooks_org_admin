import React from "react";

import {
  Grid,
} from "material-ui";

import { RegularCard, ItemGrid } from "components";
import ReactTable from 'react-table';
import { Link } from "react-router-dom";

class Published extends React.Component {
  state = {
    assessments: this.props.assessments || []
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
      assessments
    } = this.props;

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            headerColor="blue"
            cardTitle="Exámenes"
            cardSubtitle="En esta lista, encontrarás la información de tus exámenes publicados."
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
                    accessor: 'name',
                    id: 'name',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  // {
                  //   Header: 'Fecha publicado ⇵',
                  //   id: 'created_at',
                  //   accessor: assessment =>
                  //     new Date(assessment.created_at).toISOString().slice(0,10),
                  //   Filter: ({ filter, onChange }) =>
                  //     <input
                  //       onChange={event => onChange(event.target.value)}
                  //       style={{ width: '100%' }}
                  //       placeholder='Buscar'
                  //     />
                  // },
                  {
                    Header: 'Enviado a ⇵',
                    accessor: 'users_sent',
                    id: 'users_sent',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: '# Aprobados ⇵',
                    accessor: 'approved_users_amount',
                    id: 'approved_users_amount',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: 'Publicado por ⇵',
                    id: 'published_by',
                    accessor: 'published_by',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                ]}
                data={assessments}
              />
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default Published;
