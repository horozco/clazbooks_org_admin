import React from "react";
import { Grid } from "material-ui";
import { Snackbar, IconButton } from "material-ui";
import { Link } from 'react-router-dom';
import { RegularCard, ItemGrid, Button, Question } from "components";

import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import client from "../../utils/client.js";
import URLS from "../../constants/urls.js";

class Questions extends React.Component {
  state = {
    status: 'loading',
    assessment: {},
    questions: {},
    isSubmitting: false,
    showMessage: false,
    message: '',
  };

  componentWillMount() {
    return client
      .get(`${URLS.ASSESSMENTS}${this.props.match.params.id}/questions`)
      .then(({ data }) => {
        this.setState({
          questions: data.questions,
          status: 'success',
        }, () => {
          client
            .get(`${URLS.ASSESSMENTS}${this.props.match.params.id}`)
            .then(({ data }) => {
              this.setState({
                assessment: data.assessment,
              });
            });
        });
      })
      .catch(() => {
        this.setState({
          status: 'error',
        });
      });
  }

  _goBack = e => {
    e.preventDefault();
    this.props.history.goBack();
  };

  _handleError = errorMessage => {
    this.setState({
      showMessage: true,
      isSubmitting: false,
      message: errorMessage,
    });
  };

  _handleErrorMessageClose = () => {
    this.setState({ showMessage: false, message: '' });
  };

  _handleAddQuestion = () => {
    const newQuestion = {
      id: '',
      body: '',
      answers: []
    }
    this.setState({
      questions: [...this.state.questions, newQuestion]

    })
  }

  BackLink = props => <Link to={`/assessments`} {...props} onClick={this._goBack} />;

  render() {

    const {
      status,
      isSubmitting,
      showMessage,
      questions,
      message,
      assessment,
    } = this.state;

    if (status == 'loading') {
      return <h1>Cargando...</h1>;
    }

    return (
      <React.Fragment>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <h1>{`Preguntas para ${assessment.name}`}</h1>

            {
              questions.map((question, i) => {
                return <Question id={question.id} body={question.body} answers={question.answers} index={i} key={i}/>
              })
            }

            <Button color="primary" component={this.BackLink}>
              Regresar
            </Button>
          </ItemGrid>
          <Button
            onClick={this._handleAddQuestion}
            variant="fab"
            color="info"
            aria-label="addQuestion"
            customClasses="floating-button"
            round
          >
            <AddIcon />
          </Button>
        </Grid>
        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'left'}}
          open={showMessage}
          onClose={this._handleErrorMessageClose}
          message={<span>{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this._handleErrorMessageClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </React.Fragment>
    );
  }
}

export default Questions;
