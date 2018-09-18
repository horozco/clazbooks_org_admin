import React from 'react';
import { Grid } from "material-ui";
import { RegularCard, ItemGrid } from "components";
import {
  TextField,
  Radio
} from "material-ui";

class Answer extends React.Component {
  state = {
    questionId: this.props.questionId || '',
    id: this.props.id || '',
    body: this.props.body || '',
    correct_answer: this.props.correct_answer || false,
    index: this.props.index + 1 || '',
  }

  _handleChange = field => event => {
    this.setState(
      {
        [field]: event.target ? event.target.value : event,
      },
    );
  };

  _handlecorrectAnswerChange = event => {
    this.setState(
      {
        correct_answer: event.target.value
      }
    )
  }

  render() {
    const {
      questionId,
      id,
      body,
      correct_answer,
      index,
    } = this.state;

    return (
      <Grid container>
        <ItemGrid xs={2} sm={2} md={2}>
          <Radio
            checked={ correct_answer===true }
            onChange={ this._handlecorrectAnswerChange }
            value={true}
            name={`correct_answer${questionId}`}
            aria-label={`body${index}`}
          />
        </ItemGrid>
        <ItemGrid xs={10} sm={10} md={10}>
          <TextField
            id={`body${index}`}
            label={`Respuesta #${index}`}
            name={`body${index}`}
            onChange={this._handleChange('body')}
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
