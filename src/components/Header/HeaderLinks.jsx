import React from "react";
import classNames from "classnames";
import { Manager, Target, Popper } from "react-popper";
import { SessionConsumer } from "components/Session/SessionContext.jsx";
import { withRouter } from "react-router-dom";
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

import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";

const Signout = withRouter(
  ({history}) => (
    <SessionConsumer>
      {
        session => (
          <MenuItem
            onClick={() => {
              session.signout().then(() => {
                history.push("/")
              })
            }}
          >
            Cerrar Sesión
          </MenuItem>
        )
      }
    </SessionConsumer>
  )
);

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
        <IconButton
          color="inherit"
          aria-label="Configuración"
          className={classes.buttonLink}
        >
          <Settings className={classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>Configuración</p>
          </Hidden>
        </IconButton>
        
        <Manager style={{ display: "inline-block" }}>
          <Target>
            <IconButton
              color="inherit"
              aria-label="Work"
              aria-owns={open ? "menu-list" : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              className={classes.buttonLink}
            >
              <Work className={classes.links} />
              <Hidden mdUp>
                <p onClick={this.handleClick} className={classes.linkText}>
                  Mi Cuenta
                </p>
              </Hidden>
            </IconButton>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperResponsive
            }
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow
                in={open}
                id="menu-list"
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper className={classes.dropdown}>
                  <MenuList role="menu">
                    <Signout />
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
