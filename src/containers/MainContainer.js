import React, { Component } from 'react';
import MainControlsOverlay from '../components/MainControlsOverlay';
import PurchaseDialog from '../components/PurchaseDialog';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import MetaMaskStatus from '../components/MetaMaskStatus';
import UIGrid from '../components/UIGrid';
import * as Enums from '../constants/Enums';

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
      onBuyoutEnabledChanged: this.props.actions.changeBuyoutEnabled,
      purchasePlot: this.props.actions.completePlotPurchase
    };

    return (
      (this.props.metamaskState != Enums.METAMASK_STATE.OPEN) ?
      <MetaMaskStatus metamaskState={this.props.metamaskState} />
      :
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
          imageData={this.props.imageFileInfo ? this.props.imageFileInfo.fileData : ''}
          contractInfo={this.props.contractInfo}
          plots={this.props.plots}
          togglePurchaseFlow={this.props.actions.togglePurchaseFlow}
          changeZoom={this.props.actions.changeZoom} />
        <PurchaseDialog
          cancelPlotPurchase={this.props.actions.cancelPlotPurchase}
          {...this.props.purchaseDialog} />
      </div>
    );
  }
}

export default withStyles(styles)(MainContainer);
