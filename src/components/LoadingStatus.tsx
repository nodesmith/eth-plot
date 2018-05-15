import Help from '@material-ui/icons/Help';
import Home from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import { Badge, CircularProgress, Snackbar, SnackbarContent } from 'material-ui';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button, { ButtonProps } from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { LinearProgress, LinearProgressProps } from 'material-ui/Progress';
import { SvgIconProps } from 'material-ui/SvgIcon';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as Actions from '../actions';
import { ContractInfo, PlotInfo, Rect } from '../models';

import FloatingLogo from './FloatingLogo';

const styles: StyleRulesCallback = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  progressRoot: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    marginBottom: theme.spacing.unit * 2
  }
});

export interface LoadingStatusProps extends WithStyles {
  message: string;
  progress: number;
}

class LoadingStatus extends React.Component<LoadingStatusProps> {

  render() {
    const { classes } = this.props;

    const progressProps: LinearProgressProps = {
      classes: { root: this.props.classes.progressRoot },
      variant: 'buffer',
      value: this.props.progress,
      valueBuffer: this.props.progress + 5
    };

    return (
      <Grid container className={classes.root} justify="center" alignItems="center">
        <Grid item xs={4}>
          <LinearProgress {...progressProps}/>
          <Typography align="center" variant="title">
            {this.props.message}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(LoadingStatus);
  
