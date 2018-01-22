import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import ShoppingCart from 'material-ui-icons/ShoppingCart';

import ZoomControl from './ZoomControl';


const padding = 24;
const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
  },
  zoom: {
    left: padding,
    bottom: padding,
    position: 'absolute',
    display: 'inline'
  },
  purchase: {
    right: padding,
    bottom: padding,
    position: 'absolute'
  }
});


class MainControlsOverlay extends Component {
  changeZoom() {

  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.zoom}>
          <ZoomControl scale={3} changeZoom={this.changeZoom.bind(this)}/>
        </div>
        <Button fab color="secondary" aria-label="buy plot" className={classes.purchase}>
          <ShoppingCart />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(MainControlsOverlay);
