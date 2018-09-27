import React from 'react';
import { Grid } from "material-ui";
import { RegularCard, ItemGrid } from "components";
import {
  TextField,
  Radio
} from "material-ui";

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
      handleCorrectAnswerChange
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
        <ItemGrid xs={10} sm={10} md={10}>
          <TextField
            id={`body${index}`}
            label={`Respuesta #${index}`}
            name={`body${index}`}
            onChange={this._handleAnswerChange(questionIndex, index)}
            value={body}
            fullWidth
            margin="normal"
            required
          />
        </ItemGrid>
      </Grid>
    )
  }
}

export default Answer;
