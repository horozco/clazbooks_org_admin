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
    questions: [],
    isSubmitting: false,
    showMessage: false,
    message: '',
  };

  componentDidMount() {
    const questionsPromise = client
      .get(`${URLS.ASSESSMENTS}${this.props.match.params.id}/questions`);
    const assesmentPromise = client
      .get(`${URLS.ASSESSMENTS}${this.props.match.params.id}`)

    return Promise.all([questionsPromise, assesmentPromise])
      .then(([questions, assessment]) => {
        this.setState({
          questions: questions.data.questions,
          status: 'success',
          assessment: assessment.data.assessment,
        })
      }).catch(() => {
        this.setState({
          status: 'error',
        });
      });
  }

  _editQuestion = (index, body) => {
    this.setState({
      questions: this.state.questions.map((item, idx) => {
        return idx === index ? Object.assign({}, item, {
          body
        }) : item
      })
    })
  }

  _addQuestion = () => {
    const newQuestions = this.state.questions.concat([{
      body: '',
      answers: []
    }]);
    this.setState({
      questions: newQuestions
    })
  }

  _removeQuestion = (questionIndex) => {
    const question = this.state.questions[questionIndex];
    if (question.id) {
      const url = `${URLS.ASSESSMENTS}${this.props.match.params.id}/questions/${question.id}}`
      return client.delete(url)
        .then(() => {
          this.removeQuestionFromState(questionIndex);
        })
    } else {
      this.removeQuestionFromState(questionIndex);
    }
  }

  removeQuestionFromState = (questionIndex) => {
    this.state.questions.splice(questionIndex, 1);
    this.setState({
      questions: this.state.questions,
      showMessage: true,
      message: 'Se ha eliminado la pregunta correctamente.'
    })
  }

  _addAnswer = (questionIndex, target, fromQuestion=null) => {
    const { questions } = this.state;
    const question = questions[questionIndex];
    const answers = question.answers.concat([{body: '', correct_answer: false}])
    const editedQuestion = Object.assign({}, question, {
      answers
    });
    const newQuestions = [
      ...questions.slice(0, questionIndex),
      editedQuestion,
      ...questions.slice(questionIndex + 1)
    ];
    this.setState({
      questions: newQuestions
    }, () => {
      if (target) {
        const form = target.form;
        const currentFormindex = Array.prototype.indexOf.call(form, target);
        form.elements[currentFormindex + (fromQuestion ? 2 : 3)].focus();
      }
    })
  }

  _removeAnswer = (questionIndex, answerIndex) => {
    const { questions } = this.state;
    const question = questions[questionIndex];
    question.answers[answerIndex] = {...question.answers[answerIndex], ...{'_destroy' : true}};
    const editedQuestion = Object.assign({}, question, {
      answers: question.answers
    });
    const newQuestions = [
      ...questions.slice(0, questionIndex),
      editedQuestion,
      ...questions.slice(questionIndex + 1)
    ];
    this.setState({
      questions: newQuestions
    })
  }

  _editAnswer = (questionIndex, index, data = {}, reset = false) => {
    const { questions } = this.state;
    const question = questions[questionIndex];
    const answers = question.answers.map((ans, idx) => {
      let newObj = Object.assign({}, ans);
      if(reset) {
        newObj = Object.assign(newObj, {
          correct_answer: reset ? false : ans.correct_answer
        })
      }
      if(idx === index) {
        newObj = Object.assign(newObj, data)
      }
      return newObj;
    });
    const editedQuestion = Object.assign({}, question, {
      answers
    });
    const newQuestions = [
      ...questions.slice(0, questionIndex),
      editedQuestion,
      ...questions.slice(questionIndex + 1)
    ];
    this.setState({
      questions: newQuestions
    })
  }

  _onQuestionSubmit = (index) => {
    const { questions } = this.state;
    const question = questions[index];
    const method = question.id ? 'put' : 'post';
    const url = `${URLS.ASSESSMENTS}${this.props.match.params.id}/questions${question.id ? `/${question.id}` : ''}`
    return client({
      url,
      method,
      data: {
        'question':
          Object.assign({}, question, {
            answers_attributes: question.answers
          })
      }
    }).then(res => {
      this.setState({
        questions: this.state.questions.map((item, idx) => {
          if(idx === index) {
            return res.data.question;
          }
          return item;
        }),
        showMessage: true,
        message: 'Se ha guardado la pregunta correctamente.'
      })
    }).catch(({response: {data: {errors: errors}}}) => {
      console.log(errors);
      this.setState({
        showMessage: true,
        message: errors
      });
    })
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
              questions.length <= 0 &&
                <p>Usted no ha creado ninguna pregunta. Cree una con el botón flotante en la parte inferior derecha.</p>
            }

            {
              questions && questions.map((question, i) => {
                return <Question
                  assessmentId={assessment.id}
                  onEditQuestion={this._editQuestion}
                  onRemoveQuestion={this._removeQuestion}
                  onAddAnswer={this._addAnswer}
                  onRemoveAnswer={this._removeAnswer}
                  onEditAnswer={this._editAnswer}
                  id={question && question.id}
                  body={question && question.body}
                  answers={question && question.answers}
                  onSubmit={this._onQuestionSubmit}
                  index={i}
                  key={i}
                />
              })
            }

            <Button color="primary" component={this.BackLink}>
              Regresar
            </Button>
          </ItemGrid>
          <Button
            onClick={this._addQuestion}
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
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
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
