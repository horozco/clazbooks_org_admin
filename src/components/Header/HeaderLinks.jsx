import React from "react";
import classNames from "classnames";
import { Manager, Target, Popper } from "react-popper";

import {
  withStyles,
  IconButton,
  MenuItem,
  MenuList,
  Grow,
  Paper,
  ClickAwayListener,
  Hidden
} from "material-ui";
import { Work, Settings } from "@material-ui/icons";
import { Link } from "react-router-dom";

import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";


class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div>
        <Link to={`/settings`}>
          <IconButton
            color="inherit"
            aria-label="Configuración"
            className={classes.buttonLink}
            style={{width: '120px'}}
          >
            <Settings className={classes.links} style={{marginRight: '14px'}}/>
            <p className={classes.linkText}>Ajustes</p>
          </IconButton>
        </Link>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
