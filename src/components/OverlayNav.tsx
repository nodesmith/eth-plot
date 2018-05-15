import Help from '@material-ui/icons/Help';
import Home from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import { Badge, Snackbar, SnackbarContent } from 'material-ui';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button, { ButtonProps } from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { SvgIconProps } from 'material-ui/SvgIcon';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

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
    position: 'fixed',
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
  minButton: {
    minWidth: 32,
    paddingTop: 8,
    paddingBottom: 8
  },
  navWrappers: {
    right: padding,
    top: padding,
    width: sideIconSize,
    position: 'fixed',
    display: 'inline',
  },
  otherNav: {
    pointerEvents: 'all',
    backgroundColor: theme.palette.grey[200]
  },
  snackbarMessage: {
    textAlign: 'center',
    padding: `${theme.spacing.unit}px 0`,
    width: '100%'
  }
});

export interface OverlayNavProps extends WithStyles {
  notificationCount: number;
  clearNotifications: () => void;
  doNavigation: (route: string) => void;
  currentPath: string;
  snackbarMessage: string;
}

class OverlayNav extends React.Component<OverlayNavProps, {snackbarOpen: boolean}> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      snackbarOpen: false
    };
  }

  clearNotifications() {
    this.props.clearNotifications();
  }

  navigate(to) {
    if (this.props.currentPath !== to) { 
      this.props.doNavigation(to);
    }
  }

  getButtonColor(pathName: string) : 'default' | 'primary' {
    return this.props.currentPath === pathName ? 'primary' : 'default';
  }

  createNavButton(path: string, tooltip: string, icon: JSX.Element, clickHandler?: () => void): JSX.Element {
    const { classes } = this.props;
    const buttonProps: ButtonProps = {
      color: 'default',
      size: 'small',
      classes: { sizeSmall: classes.minButton }
    };

    return (
    <Tooltip title={tooltip} key={tooltip} placement="left">
      <Button {...buttonProps} color={this.getButtonColor(path)} onClick={() => {
        if (clickHandler) {
          clickHandler();
        }

        this.navigate(path);
      }}>
        {icon}
      </Button>
    </Tooltip>);
  }

  componentDidUpdate(prevProps: OverlayNavProps) {
    if (this.props.snackbarMessage !== prevProps.snackbarMessage) {
      const validMessage = !!this.props.snackbarMessage;
      this.setState({ snackbarOpen: validMessage });
    }
  }

  render() {
    const { classes } = this.props;

    const buttonProps: ButtonProps = {
      color: 'default',
      size: 'small',
      classes: { sizeSmall: classes.minButton }
    };

    const transactionsIcon = this.props.notificationCount ?
      (<Badge color="primary" className={this.props.classes.badge} badgeContent={this.props.notificationCount} >
        <Notifications />
      </Badge>) :
      (<Notifications />);

    return (
      <div className={classes.root}>
        <FloatingLogo size={logoSize} classes={{ root: classes.homeButton }} onClick={this.navigate.bind(this, '/')} />
        <div className={classes.navWrappers}>
          <Paper className={classes.otherNav}>
            {this.createNavButton('/', 'Home', (<Home />))}
            {this.createNavButton('/myplots', 'My Plots', (<Person />))}
            {this.createNavButton('/account', 'Transactions', transactionsIcon, () => this.clearNotifications())}
            {this.createNavButton('/about', 'About', (<Help />))}
          </Paper>
        </div>
        <Snackbar
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          autoHideDuration={5000}
          open={this.state.snackbarOpen}
          onClose={() => this.setState({ snackbarOpen: false })}
        >
          <SnackbarContent classes={{ message: this.props.classes.snackbarMessage }}
            message={(<span>{this.props.snackbarMessage}</span>)}>
          </SnackbarContent>
        </Snackbar>
      </div >
    );
  }
}

export default withStyles(styles)(OverlayNav);
  
