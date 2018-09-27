import React from "react";

import {
  Done,
  DoneAll,
  Web,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility,
  Save,
  Cancel,
  Close,
  AddCircleOutline,
  Add,
} from "@material-ui/icons";

import {
  withStyles,
  Snackbar,
  IconButton,
  Grid,
} from "material-ui";

import { SessionConsumer } from "components/Session/SessionContext.jsx";

import { StatsCard, ChartCard, RegularCard, ItemGrid, Button } from "components";
import ReactTable from 'react-table';

import { Link } from "react-router-dom";
import client from '../../utils/client';
import URLS from "../../constants/urls.js";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

import Published from './Published'
import New from './New'
import Approved from './Approved'

class Assessments extends React.Component {
  state = {
    status: "loading",
    published_assessments: 0,
    assessments: [],
    books: [],
    showMessage: false,
    currentPage: 'published',
    isSubmitting: false
  };

  componentDidMount() {
    this._getAllAssessments();
    this._getAllBooks();
  }

  _getAllAssessments = () => {
    return client
      .get(URLS.ASSESSMENTS)
        .then(({ data: assessments }) => {
          this.setState({
            ...assessments,
            ...{published_assessments: assessments.assessments.length}
          });
        })
        .catch(() => {
          this.setState({
            status: "error"
          });
        });
  };

  _getAllBooks = () => {
    return client
      .get(URLS.BOOKS)
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
  };

  _handleError = (errorMessage, hideModal) => {
    const message = errorMessage.constructor == Array ? errorMessage.join(' - ') : errorMessage;
    if (hideModal) {
      this.setState({
        currentAssessment: {
          id: null,
          book_id: '',
          name: '',
          duration: '',
          approval_value: '',
          expiration_date: '',
        },
        showMessage: true,
        isSubmitting: false,
        message: message,
        openFormModal: false,
      });
    } else {
      this.setState({
        showMessage: true,
        isSubmitting: false,
        message: message,
      });
    }
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  _handleClickSave = () => {
    this.setState({ openFormModal: true });
  };

  _handlePageChange = pageName => event => {
    this.setState({currentPage: pageName})
  }

  render() {
    const {
      status,
      published_assessments,
      assessments,
      showMessage,
      message,
      currentAssessment,
      isSubmitting,
      books,
      currentPage,
    } = this.state;

    if(status == 'loading') {
      return <h1>Cargando...</h1>
    }

    return (
      <SessionConsumer>
        {
          session => (
            <div>
              <Grid container>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={Done}
                    iconColor="red"
                    title="Exámenes publicados"
                    description={published_assessments}
                    small=""
                    statIcon={Done}
                    statIconColor="danger"
                    statText="Información general de tus exámenes publicados."
                    onClick={this._handlePageChange('published')}
                    selected={currentPage==='published'}
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={DoneAll}
                    iconColor="orange"
                    title="Gestionar Exámenes"
                    description={'#'}
                    statIcon={DoneAll}
                    statText="Crea o Edita exámenes de Clazbooks o de tu organización."
                    onClick={this._handlePageChange('new')}
                    selected={currentPage==='new'}
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={4}>
                  <StatsCard
                    icon={Web}
                    iconColor="green"
                    title="Exámenes Aprobados"
                    description={'#'}
                    statIcon={Web}
                    statText="Información de los exámenes aprobados por tus estudiantes."
                    onClick={this._handlePageChange('approved')}
                    selected={currentPage==='approved'}
                  />
                </ItemGrid>
              </Grid>

              { currentPage === 'published' ? <Published assessments={assessments} /> : null }
              { currentPage === 'new' ?
                <New
                  assessments={assessments}
                  books={books}
                  handleError={this._handleError}
                  isSubmitting={isSubmitting}
                  history={this.props.history}
                />
                : null }
              { currentPage === 'approved' ? <Approved assessments={assessments} /> : null }

              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={showMessage}
                onClose={this._handleErrorMessageClose}
                message={<span>{this.state.message}</span>}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={this._handleErrorMessageClose}
                  >
                    <Close />
                  </IconButton>,
                ]}
              />
            </div>
          )
        }
      </SessionConsumer>
    );
  }
}

export default withStyles(dashboardStyle)(Assessments);
