import React from 'react';
import { withRouter } from "react-router-dom";
import { SessionConsumer } from "components/Session/SessionContext.jsx";

function Signout({ component, history }) {
  return <SessionConsumer>
    {session => (
      <span
        onClick={() => {
          session.signout().then(() => {
            history.push("/");
          });
        }}
      >
        {component}
      </span>
    )}
  </SessionConsumer>
}

export default withRouter(Signout);
