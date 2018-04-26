import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
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
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button color="inherit" onClick={this.navigate.bind(this, '/')}>
              <Typography color="inherit">
                Eth Grid
              </Typography>
            </Button>

            <Button color="inherit" onClick={this.navigate.bind(this, '/myplots')}>
              <Typography color="inherit">
                My Plots
              </Typography>
            </Button>


            <Button color="inherit" onClick={this.navigate.bind(this, '/about')}>
              <Typography color="inherit">
                About
              </Typography>
            </Button>

            <span className={this.props.classes.flex} />
            <IconButton onClick={() => { this.clearNotifications(); this.navigate('/account'); }} color="inherit" >
              { (this.props.notificationCount) ?
              (<Badge className={this.props.classes.badge} badgeContent={this.props.notificationCount} color="secondary">
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
