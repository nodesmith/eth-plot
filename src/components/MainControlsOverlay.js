import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import Drawer from 'material-ui/Drawer';

import ZoomControl from './ZoomControl';
import PurchaseFlowCard from './PurchaseFlowCard';


const padding = 24;
const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none'
  },
  zoom: {
    left: padding,
    bottom: padding,
    position: 'absolute',
    display: 'inline',
    pointerEvents: 'all'
  },
  purchase: {
    right: padding,
    bottom: padding,
    position: 'absolute',
    pointerEvents: 'all'
  },
  drawer: {
    // marginTop: '64px',
    width: 400,
    pointerEvents: 'all'
  }
});


class MainControlsOverlay extends Component {
  constructor(...args) {
    super(...args);
  }

  toggleDrawer() {
    this.props.togglePurchaseFlow();
  }

  render() {
    const { classes } = this.props;
    const sideList = (<PurchaseFlowCard onClose={() => this.toggleDrawer()} {...this.props.purchaseActions} {...this.props.purchase}/>);
    return (
      <div className={classes.root}>
        <div className={classes.zoom}>
          <ZoomControl scale={this.props.zoomLevel} changeZoom={this.props.changeZoom}/>
        </div>
        {this.props.purchase.purchaseFlowOpen ? null : 
          <Button fab color="secondary" aria-label="buy plot" className={classes.purchase} onClick={() => this.toggleDrawer()}>
            <ShoppingCart />
          </Button>
        }
        <Drawer classes={{
            paper: classes.drawer
          }}
          anchor="right"
          type="persistent"
          open={this.props.purchase.purchaseFlowOpen}
          onClose={() => this.toggleDrawer()}>
          {sideList}
        </Drawer>
      </div>
    );
  }
}

MainControlsOverlay.propTypes = {
  zoomLevel: PropTypes.number.isRequired,
  changeZoom: PropTypes.func.isRequired,
  purchase: PropTypes.object.isRequired,
  purchaseActions: PropTypes.object.isRequired
}

export default withStyles(styles)(MainControlsOverlay);
