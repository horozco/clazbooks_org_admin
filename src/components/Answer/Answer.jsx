import React from 'react';
import { Grid } from "material-ui";
import { RegularCard, ItemGrid, Button } from "components";
import {
  TextField,
  Radio
} from "material-ui";

import Delete from '@material-ui/icons/Delete';

class Answer extends React.Component {

  _handleAnswerChange = (questionIndex, index) => e => {
    this.props.onEditAnswer(questionIndex, index, {
      body: e.target.value
    });
  }

  _handleCorrectChange = (questionIndex, index, checked) => e => {
    this.props.onEditAnswer(questionIndex, index, {
      correct_answer: !checked
    }, true);
  }

  render() {
    const {
      questionId,
      id,
      body,
      correctAnswer,
      index,
      questionIndex,
      handleCorrectAnswerChange,
      handleEnter,
      handleRemove
    } = this.props;

    return (
      <Grid container>
        <ItemGrid xs={2} sm={2} md={2}>
          <Radio
            checked={correctAnswer}
            onChange={this._handleCorrectChange(questionIndex, index, correctAnswer)}
            name={`correct_answer${questionId}`}
            aria-label={`body${index}`}
          />
        </ItemGrid>
        <ItemGrid xs={8} sm={8} md={8}>
          <TextField
            id={`body${index}`}
            label={`Respuesta #${index+1}`}
            name={`body${index}`}
            onChange={this._handleAnswerChange(questionIndex, index)}
            onKeyPress={handleEnter(questionIndex)}
            value={body}
            fullWidth
            margin="normal"
            required
          />
        </ItemGrid>
        <ItemGrid xs={2} sm={2} md={2}>
          <Button
            onClick={handleRemove(questionIndex, index)}
            variant="fab"
            color="danger"
            aria-label="_handleDeleteAnswer"
            round
          >
            <Delete />
          </Button>
        </ItemGrid>
      </Grid>
    )
  }
}

export default Answer;
