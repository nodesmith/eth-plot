import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { Component } from 'react';

import { NavLink } from 'react-router-dom';

import AccountBox from 'material-ui-icons/AccountBox';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const styles: StyleRulesCallback = theme => ({
  badge: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  flex: {
    flex: 1
  },
  navbar: {
    position:'static'
  },
  navbarButton: {
    color: theme.palette.primary.contrastText
  }
});

export interface NavProps extends WithStyles {
  notificationCount: number;
  clearNotifications: () => void;
  doNavigation: (route: string) => void;
}

class Nav extends Component<NavProps> {
  clearNotifications() {
    this.props.clearNotifications();
  }

  navigate(to) {
    console.log(`Navigating to ${to}`);
    this.props.doNavigation(to);
  }

  render() {
    const createNavLink = (to: string) => {
      return (<NavLink to={to}/>);
    };
  
    return (
      <div>
        <AppBar className={this.props.classes.navbar}>
          <Toolbar>
            <Button onClick={this.navigate.bind(this, '/')}>
              <Typography className={this.props.classes.navbarButton}>
                Eth Grid
              </Typography>
            </Button>

            <Button onClick={this.navigate.bind(this, '/myplots')}>
              <Typography className={this.props.classes.navbarButton}>
                My Plots
              </Typography>
            </Button>


            <Button onClick={this.navigate.bind(this, '/about')}>
              <Typography className={this.props.classes.navbarButton}>
                About
              </Typography>
            </Button>

            <span className={this.props.classes.flex} />
            <IconButton className={this.props.classes.navbarButton} onClick={() => { this.clearNotifications(); this.navigate('/account'); }} >
              { (this.props.notificationCount) ?
              (<Badge className={this.props.classes.badge} color="secondary" badgeContent={this.props.notificationCount} >
                <AccountBox />
              </Badge>) :
              <AccountBox />
              }
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Nav);
