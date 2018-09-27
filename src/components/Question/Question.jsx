import React from 'react';
import { Grid } from "material-ui";
import { RegularCard, ItemGrid, Button } from "components";

import {
  TextField,
} from "material-ui";

import Answer from "../Answer/Answer.jsx";
import AddIcon from '@material-ui/icons/Add';

class Question extends React.Component {

  _handleSubmit = (index) => e => {
    e.preventDefault();
    this.props.onSubmit(index)
  }

  _handleAddAnswer = (index) => (e) => {
    this.props.onAddAnswer(index);
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
        cardTitle={`${index}. ${body}`}
        content={
          <div>
            <Grid container>
              <ItemGrid xs={12} sm={12} md={12}>
                <form onSubmit={this._handleSubmit(index)}>
                  <TextField
                    id="body"
                    label="Título"
                    name="body"
                    onChange={(e) => onEditQuestion(index, e.target.value)}
                    value={body}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <div style={{ background: '#dadada', padding: '10px', marginTop: '12px' }}>
                    {
                      answers.map((answer, i) => {
                        return <Answer
                          questionId={index}
                          questionIndex={index}
                          index={i}
                          id={i}
                          body={answer.body}
                          correctAnswer={answer.correct_answer}
                          onEditAnswer={onEditAnswer}
                          handleCorrectAnswerChange={() => {}}
                          index={i}
                          key={i}
                        />
                      })
                    }
                  </div>
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
                    type="submit"
                    variant="fab"
                    color="info"
                    aria-label="_handleAddAnswer"
                    round
                  >
                    Save
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
