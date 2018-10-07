import React from 'react';
import { Grid } from "material-ui";
import { RegularCard, ItemGrid, Button } from "components";

import {
  TextField,
} from "material-ui";

import Answer from "../Answer/Answer.jsx";
import AddIcon from '@material-ui/icons/Add';
import Save from '@material-ui/icons/Save';
import Delete from '@material-ui/icons/Delete';

class Question extends React.Component {

  _handleSubmit = (index) => e => {
    e.preventDefault();
    this.props.onSubmit(index)
  }

  _handleAddAnswer = (index) => (e) => {
    this.props.onAddAnswer(index);
  }

  _handleRemoveAnswer = (questionIndex, answerIndex) => (e) => {
    this.props.onRemoveAnswer(questionIndex, answerIndex);
  }

  _handleRemoveQuestion = (questionIndex) => (e) => {
    if (
      window.confirm(
        '¿Está seguro que desea eliminar esta pregunta?'
      )
    ) {
      this.props.onRemoveQuestion(questionIndex);
    }
  }

  _handleEnter = (index, fromQuestion) => (event) => {
    if (event.key === 'Enter') {
      this.props.onAddAnswer(index, event.target, fromQuestion);
    }
  }

  render() {
    const {
      id,
      body,
      answers,
      index,
      correct_answer,
      onAddAnswer,
      onEditAnswer,
      onEditQuestion
    } = this.props;

    return (
      <RegularCard
        cardTitle={`${index+1}. ${body}`}
        content={
          <div>
            <Grid container>
              <ItemGrid xs={12} sm={12} md={12}>
                <form>
                  <TextField
                    id="body"
                    label="Título"
                    name="body"
                    onChange={(e) => onEditQuestion(index, e.target.value)}
                    onKeyPress={this._handleEnter(index, true)}
                    value={body}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <div style={{ background: '#dadada', padding: '10px', marginTop: '12px' }}>
                    {
                      answers && answers.length <= 0 &&
                        <div>
                          <p>No has creado respuestas para esta pregunta, escribe el título de la pregunta y presiona <strong>"Enter"</strong> para crear nuevas respuestas.</p>
                          <p>Recuerda que los cambios en preguntas y respuestas sólo quedarán guardadas cuando presiones el botón verde en la parte inferior de cada pregunta.</p>
                        </div>
                    }
                    {
                      answers && answers.map((answer, i) => {
                        return answer['_destroy'] ||
                          <Answer
                            questionId={index}
                            questionIndex={index}
                            index={i}
                            id={i}
                            body={answer.body}
                            correctAnswer={answer.correct_answer}
                            onEditAnswer={onEditAnswer}
                            handleCorrectAnswerChange={() => {}}
                            handleEnter={this._handleEnter}
                            handleRemove={this._handleRemoveAnswer}
                            index={i}
                            key={i}
                          />
                      })
                    }
                  </div>
                  <Button
                    onClick={this._handleRemoveQuestion(index)}
                    variant="fab"
                    color="danger"
                    aria-label="_handleAddAnswer"
                    round
                  >
                    <Delete />
                  </Button>
                  <Button
                    onClick={this._handleAddAnswer(index)}
                    variant="fab"
                    color="info"
                    aria-label="_handleAddAnswer"
                    round
                  >
                    <AddIcon />
                  </Button>
                  <Button
                    onClick={this._handleSubmit(index)}
                    variant="fab"
                    color="success"
                    aria-label="_handleAddAnswer"
                    round
                  >
                    <Save />
                  </Button>
                </form>
              </ItemGrid>
            </Grid>
            <br />
          </div>
        }
      />
    )
  }
}

export default Question;
