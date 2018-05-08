import ShoppingCart from 'material-ui-icons/ShoppingCart';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as Actions from '../actions';
import { ContractInfo, ImageFileInfo, InputValidation, PlotInfo, Rect } from '../models';

import PurchaseFlowCard, { PurchaseFlowCardProps } from './PurchaseFlowCard';

const padding = 24;
const styles: StyleRulesCallback = theme => ({
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
    position: 'fixed',
    display: 'inline',
    pointerEvents: 'all',
  },
  purchase: {
    right: padding,
    bottom: padding,
    position: 'fixed',
    pointerEvents: 'all'
  },
  drawer: {
    width: 400,
    pointerEvents: 'all'
  }
});


export interface MainControlsOverlayProps extends WithStyles {
  zoomLevel: number;
  changeZoom: (direction: number) => void;
  purchase: {
    rectToPurchase?: Rect;
    purchasePriceInWei: string;
    activeStep: number;
    completedSteps: {[index: number]: boolean};
    imageFileInfo?: ImageFileInfo;
    allowedFileTypes: string[];
    imageDimensions: {
      h: number;
      w: number;
    }
    website: string;
    buyoutPriceInWei: string;
    buyoutEnabled: boolean;
    purchaseFlowOpen: boolean;
    imageValidation: InputValidation;
    showHeatmap: boolean;
    showGrid: boolean;
  };
  purchaseActions: {
    onImageSelected: Actions.purchaseImageSelected;
    onStepComplete: Actions.completePurchaseStep;
    goToStep: Actions.goToPurchaseStep;
    onWebsiteChanged: Actions.changePlotWebsite;
    onBuyoutChanged: Actions.changePlotBuyout;
    onBuyoutEnabledChanged: Actions.changeBuyoutEnabled;
    purchasePlot: Actions.completePlotPurchase;
    toggleShowHeatmap: Actions.toggleShowHeatmap;
    toggleShowGrid: Actions.toggleShowGrid;
  };
  contractInfo: ContractInfo;
  plots: Array<PlotInfo>;
  togglePurchaseFlow: () => void;
  activeAccount: string;
}

class MainControlsOverlay extends Component<MainControlsOverlayProps> {

  toggleDrawer() {
    this.props.togglePurchaseFlow();
  }

  render() {
    const { classes } = this.props;

    const purchaseFlowCardProps = {
      onClose: () => this.toggleDrawer(),
      contractInfo: this.props.contractInfo,
      plots: this.props.plots,
      activeAccount: this.props.activeAccount,
      classes: {},
      ...this.props.purchase,
      ...this.props.purchaseActions
    };

    const sideList = (
      <PurchaseFlowCard {...purchaseFlowCardProps} />);
    return (
      <div className={classes.root}>
        <Slide in={!this.props.purchase.purchaseFlowOpen} direction="up"> 
          <Button variant="fab" aria-label="buy plot" className={classes.purchase} onClick={() => this.toggleDrawer()}>
            <ShoppingCart />
          </Button>
        </Slide>
        <Drawer classes={{
          paper: classes.drawer
        }}
          anchor="right"
          variant="persistent"
          open={this.props.purchase.purchaseFlowOpen}
          onClose={() => this.toggleDrawer()}>
          {sideList}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(MainControlsOverlay);
