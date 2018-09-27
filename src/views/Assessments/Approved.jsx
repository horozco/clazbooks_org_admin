import React from "react";

import {
  Grid,
} from "material-ui";

import { RegularCard, ItemGrid } from "components";

class Approved extends React.Component {
  state = {
    assessments: this.props.assessments || []
  };

  render() {
    const {
      assessments
    } = this.props;

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            headerColor="blue"
            cardTitle="Exámenes"
            cardSubtitle="En esta lista, encontrarás la información de los exámenes aprobados por tus estudiantes."
            content={''}
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default Approved;
