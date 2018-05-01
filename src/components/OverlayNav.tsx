import AccountCircle from '@material-ui/icons/AccountCircle';
import ImportExport from '@material-ui/icons/ImportExport';
import Info from '@material-ui/icons/Info';
import { Badge } from 'material-ui';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button, { ButtonProps } from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as Actions from '../actions';
import { ContractInfo, PlotInfo, Rect } from '../models';

import FloatingLogo from './FloatingLogo';

const padding = 24;
const logoSize = 50;
const sideIconSize = 38;
const styles: StyleRulesCallback = theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none'
  },
  homeButton: {
    left: padding,
    top: padding,
    position: 'fixed',
    display: 'inline',
    pointerEvents: 'all'
  },
  otherNavButton: {
    marginTop: theme.spacing.unit,
  },
  minButton: {
    minWidth: 32,
    paddingTop: 8,
    paddingBottom: 8
  },
  otherNav: {
    // left: padding + theme.spacing.unit + logoSize,
    right: padding,
    top: padding,
    width: sideIconSize,
    position: 'fixed',
    display: 'inline',
    pointerEvents: 'all',
    backgroundColor: theme.palette.grey[200]
  }
});


export interface OverlayNavProps extends WithStyles {
  notificationCount: number;
  clearNotifications: () => void;
  doNavigation: (route: string) => void;
  currentPath: string;
}

class OverlayNav extends Component<OverlayNavProps> {
  clearNotifications() {
    this.props.clearNotifications();
  }

  navigate(to) {
    console.log(`Navigating to ${to}`);
    this.props.doNavigation(to);
  }

  getButtonColor(pathName: string) : 'default' | 'primary' {
    return this.props.currentPath === pathName ? 'primary' : 'default';
  }

  render() {
    const { classes } = this.props;

    const buttonProps: ButtonProps = {
      color: 'default',
      size: 'small',
      classes: { sizeSmall: classes.minButton }
    };

    return (
      <div className={classes.root}>
        <FloatingLogo size={logoSize} classes={{ root: classes.homeButton }} onClick={this.navigate.bind(this, '/')} />
        <Paper  className={classes.otherNav}>
          <Button {...buttonProps} color={this.getButtonColor('/myplots')} key="My Plots" onClick={this.navigate.bind(this, '/myplots')}>
            <AccountCircle />
          </Button>
          <Button {...buttonProps} color={this.getButtonColor('/about')} key="About" onClick={this.navigate.bind(this, '/about')}>
            <Info />
          </Button>
          <Button {...buttonProps} color={this.getButtonColor('/account')}
            key="Transactions" onClick={() => { this.clearNotifications(); this.navigate('/account'); }}>
            { (this.props.notificationCount) ?
              (<Badge className={this.props.classes.badge} badgeContent={this.props.notificationCount} >
                <ImportExport />
              </Badge>) :
              <ImportExport />
            }
          </Button>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(OverlayNav);
