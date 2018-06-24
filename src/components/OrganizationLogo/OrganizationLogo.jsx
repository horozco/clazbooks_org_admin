import React from 'react';
import { SessionConsumer } from "components/Session/SessionContext.jsx";

function OrganizationLogo({ className }) {
  return(
    <SessionConsumer>
      {
        session => (
          <img src={session.organization_admin.organization.logo} className={className} alt="logo"></img>
        )
      }
    </SessionConsumer>
  )
}

export default OrganizationLogo;
