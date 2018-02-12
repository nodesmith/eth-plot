import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AccountBox from 'material-ui-icons/AccountBox';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  badge: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  flex: {
    flex: 1
  }
});

class Nav extends Component {
  render() {
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button component={NavLink} to="/" color="inherit">
              <Typography type="title" color="inherit">
                Eth Grid
              </Typography>                                 
            </Button>
            <Button component={NavLink} to="/myplots" color="inherit">My Plots</Button>
            <Button component={NavLink} to="/about" color="inherit">About</Button>
            <span className={this.props.classes.flex} />
            <IconButton component={NavLink} color="inherit" to="/account">
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

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
  notificationCount: PropTypes.number.isRequired,
};

export default withStyles(styles)(Nav);