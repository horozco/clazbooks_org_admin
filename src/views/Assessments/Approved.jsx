import React from "react";

import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "material-ui";

import CloseIcon from '@material-ui/icons/Close';
import School from '@material-ui/icons/School';

import { RegularCard, ItemGrid, Button } from 'components';
import ReactTable from 'react-table';
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

class Approved extends React.Component {
  state = {
    assessments: this.props.assessments || [],
    users: [],
    openShowUserModal: false,
    currentUser: null
  };

  componentDidMount() {
    this._getAllUsersStats();
  }

  _getAllUsersStats = () => {
    return client
      .get(`${URLS.ASSESSMENTS}statistics`)
        .then(({ data: users }) => {
          this.setState({
            ...users,
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  };

  _handleShowUser = (user) => event => {
    event.preventDefault();
    this.setState({
      openShowUserModal: true,
      currentUser: user,
    });
  };

  _handleCloseModal = () => {
    this.setState({
      openShowUserModal: false,
      currentUser: {},
    });
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
      assessments,
    } = this.props

    const {
      users,
      openShowUserModal,
      currentUser
    } = this.state;

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            headerColor="blue"
            cardTitle="Exámenes"
            cardSubtitle="En esta lista, encontrarás la información de los exámenes aprobados por tus estudiantes."
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
                    Header: 'Email a ⇵',
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
                    Header: 'Preguntas acertadas ⇵',
                    id: 'correct_responses',
                    accessor: 'correct_responses',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: 'Preguntas fallidas ⇵',
                    id: 'failed_responses',
                    accessor: 'failed_responses',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: 'Promedio de notas ⇵',
                    accessor: user =>
                      parseInt(user.avg_rate),
                    id: 'avg_rate',
                    Filter: ({ filter, onChange }) =>
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        placeholder='Buscar'
                      />
                  },
                  {
                    Header: 'Opciones',
                    id: 'options',
                    filterable: false,
                    accessor: user =>
                      <React.Fragment>
                        <a href="#" onClick={this._handleShowUser(user)}>
                          Diplomas
                        </a>
                      </React.Fragment>
                  },
                ]}
                data={users}
              />
            }
          />
        </ItemGrid>
        <Dialog
          open={openShowUserModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Diplomas obtenidos
          </DialogTitle>
          {
            currentUser ?
            <DialogContent>
              <DialogContentText>
                {`Esta es la información detallada de los diplomas obtenidos por ${currentUser.name}`}
              </DialogContentText>
              <Grid container>
                <ItemGrid xs={12} sm={12} md={12}>
                  <List>
                    {
                      currentUser.diplomas && currentUser.diplomas.map((diploma, key) => {
                        return (
                          <ListItem key={key}>
                            <Avatar>
                              <School />
                            </Avatar>
                            <ListItemText
                              primary={diploma.assessment_name}
                              secondary={
                                new Date(diploma.approval_date).toISOString().slice(0,10)
                              }
                            />
                          </ListItem>
                        );
                      })
                    }
                  </List>
                </ItemGrid>
              </Grid>
            </DialogContent> : null
          }
          <DialogActions>
            <Button onClick={this._handleCloseModal} color="primary">
              <CloseIcon /> Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default Approved;
