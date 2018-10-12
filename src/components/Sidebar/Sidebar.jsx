import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import cx from "classnames";
import {
  withStyles,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "material-ui";

import { PowerSettingsNew } from '@material-ui/icons';

import { HeaderLinks } from "components";
import Signout from "../Session/Signout.jsx";
import { isSuperAdmin, managedOrganizations } from '../../utils/session.js';

import Logo from "components/OrganizationLogo/OrganizationLogo.jsx";

import sidebarStyle from "assets/jss/material-dashboard-react/sidebarStyle.jsx";

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }

  const { classes, color, logo, image, routes } = props;

  var links = (
    <List className={classes.list}>
      {
        isSuperAdmin() ?
          <ListItem button className={classes.itemLink}>
            <ListItemText
              primary={'Seleccionar Organización'}
              className={classes.itemText}
              disableTypography={true}
            />
            <Select
              value={props.managedOrganization}
              onChange={props.changeManagedOrganization}
              name='managed_organization_id'
              inputProps={{
                name: 'managed_organization',
                id: 'managed_organization_id',
              }}
              style={{zIndex: 0, color: 'white'}}
            >
             {
              managedOrganizations().map((organization, key) =>
                <MenuItem value={organization.id} key={key}>{organization.name}</MenuItem>
              )
             }
            </Select>
          </ListItem> : null
      }
      {routes.filter(item => item.noSidebar !== true).map((prop, key) => {
        if (prop.redirect) return null;
        const listItemClasses = cx({
          [" " + classes[color]]: activeRoute(prop.path)
        });
        const whiteFontClasses = cx({
          [" " + classes.whiteFont]: activeRoute(prop.path)
        });
        return (
          <NavLink
            to={prop.path}
            className={classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                <prop.icon />
              </ListItemIcon>
              <ListItemText
                primary={prop.sidebarName}
                className={classes.itemText + whiteFontClasses}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
      <hr className={classes.divider}/>
      <Signout component={
        <ListItem button className={classes.itemLink}>
          <ListItemIcon className={classes.itemIcon}>
            <PowerSettingsNew />
          </ListItemIcon>
          <ListItemText
            primary={'Cerrar Sesión'}
            className={classes.itemText}
            disableTypography={true}
          />
        </ListItem>
      }/>
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a href="/" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <Logo className={classes.img}></Logo>
        </div>
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <HeaderLinks />
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(sidebarStyle)(Sidebar);
