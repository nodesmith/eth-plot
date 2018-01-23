import React, { Component } from 'react';
import PurchaseModal from '../components/PurchaseModal';
import MainControlsOverlay from '../components/MainControlsOverlay';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import UIGrid from '../components/UIGrid';


const styles = theme => ({
  root: {
    position: 'relative',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 54px)',
    }
  }
});


class MainContainer extends Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <UIGrid {...this.props}
          inPurchaseMode={this.props.purchase.purchaseFlowOpen}
          imageToPurchase={this.props.purchase.imageToPurchase}
          rectToPurchase={this.props.purchase.rectToPurchase}/>
        <MainControlsOverlay
          purchase={this.props.purchase}
          zoomLevel={this.props.scale}
          onImageSelected={this.props.actions.purchaseImageSelected}
          togglePurchaseFlow={this.props.actions.togglePurchaseFlow}
          changeZoom={this.props.actions.changeZoom} />
      </div>
    );
  }
}

export default withStyles(styles)(MainContainer);
