import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';

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
  },
  drawer: {
    marginTop: '64px',
    width: 400
  }
});


class MainControlsOverlay extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      drawerOpen: false
    };
  }

  changeZoom() {

  }

  toggleDrawer(isOpen) {
    this.setState({
      drawerOpen: isOpen
    });
  }

  render() {
    const { classes } = this.props;
    const sideList = (<PurchaseFlowCard onClose={() => this.toggleDrawer(false)}/>);
    return (
      <div className={classes.root}>
        <div className={classes.zoom}>
          <ZoomControl scale={3} changeZoom={this.changeZoom.bind(this)}/>
        </div>
        {this.state.drawerOpen ? null : 
          <Button fab color="secondary" aria-label="buy plot" className={classes.purchase} onClick={() => this.toggleDrawer(true)}>
            <ShoppingCart />
          </Button>
        }
        <Drawer classes={{
            paper: classes.drawer
          }} 
          anchor="right"
          type="persistent"
          open={this.state.drawerOpen}
          onClose={() => this.toggleDrawer(false)}>
          {sideList}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(MainControlsOverlay);
