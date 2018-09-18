import React from 'react';
import { Grid } from "material-ui";
import { RegularCard, ItemGrid, Button } from "components";

import {
  TextField,
} from "material-ui";

import Answer from "../Answer/Answer.jsx";
import AddIcon from '@material-ui/icons/Add';

class Question extends React.Component {
  state = {
    id: this.props.id || '',
    body: this.props.body || '',
    answers: this.props.answers || [],
    index: this.props.index + 1 || '',
  }

  _handleChange = field => event => {
    this.setState(
      {
        [field]: event.target ? event.target.value : event,
      },
    );
  };

  _handleSubmit = organizationId => event => {
    event.preventDefault();
  }

  _handleAddAnswer = () => {
    const newAnswer = {
      id: '',
      body: '',
      correct_answer: false
    }
    this.setState({
      answers: [...this.state.answers, newAnswer]
    })
  }

  render() {
    const {
      id,
      body,
      answers,
      index,
    } = this.state;

    return (
      <RegularCard
        cardTitle={`${index}. ${body}`}
        content={
          <div>
            <Grid container>
              <ItemGrid xs={12} sm={12} md={12}>
                <form onSubmit={this._handleSubmit()}>
                  <TextField
                    id="body"
                    label="Título"
                    name="body"
                    onChange={this._handleChange('body')}
                    value={body}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <div style={{ background: '#dadada', padding: '10px', marginTop: '12px' }}>
                    {
                      answers.map((answer, i) => {
                        return <Answer questionId={id} id={answer.id} body={answer.body} correct_answer={answer.correct_answer} index={i} key={i}/>
                      })
                    }
                  </div>
                  <Button
                    onClick={this._handleAddAnswer}
                    variant="fab"
                    color="info"
                    aria-label="_handleAddAnswer"
                    round
                  >
                    <AddIcon />
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
