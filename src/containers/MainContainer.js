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
    },
    userDrag: 'none'
  }
});

class MainContainer extends Component {
  render() {
    const purchaseActions = {
      onImageSelected: this.props.actions.purchaseImageSelected,
      goToStep: this.props.actions.goToPurchaseStep,
      onStepComplete: this.props.actions.completePurchaseStep,
      onWebsiteChanged: this.props.actions.changePlotWebsite,
      onBuyoutChanged: this.props.actions.changePlotBuyout,
      onBuyoutEnabledChanged: this.props.actions.changeBuyoutEnabled
    }
    return (
      <div className={this.props.classes.root}>
        <UIGrid {...this.props}
          inPurchaseMode={this.props.purchase.purchaseFlowOpen}
          currentTransform={this.props.purchase.currentTransform}
          imageToPurchase={this.props.imageFileInfo}
          rectToPurchase={this.props.purchase.rectToPurchase}/>
        <MainControlsOverlay
          purchase={this.props.purchase}
          zoomLevel={this.props.scale}
          purchaseActions={purchaseActions}
          contractInfo={this.props.contractInfo}
          plots={this.props.plots}
          togglePurchaseFlow={this.props.actions.togglePurchaseFlow}
          changeZoom={this.props.actions.changeZoom} />
      </div>
    );
  }
}

export default withStyles(styles)(MainContainer);
