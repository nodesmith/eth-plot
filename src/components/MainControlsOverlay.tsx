import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import Drawer from 'material-ui/Drawer';

import { ZoomControlComponent } from './ZoomControl';
import PurchaseFlowCard, { PurchaseFlowCardProps } from './PurchaseFlowCard';
import { ContractInfo, PlotInfo, Rect } from '../models';
import * as Actions from '../actions';


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


export interface MainControlsOverlayProps extends WithStyles {
  zoomLevel: number;
  changeZoom: (direction: number) => void;
  purchase: {
    rectToPurchase?: Rect;
    purchasePriceInWei: string;
    activeStep: number;
    completedSteps: {[index: number]: boolean};
    imageName: string;
    imageDimensions: {
      h: number;
      w: number;
    }
    website: string;
    buyoutPriceInWei: string;
    buyoutEnabled: boolean;
    purchaseFlowOpen: boolean;
  }
  purchaseActions: {
    onImageSelected: Actions.purchaseImageSelected;
    onStepComplete: Actions.completePurchaseStep;
    goToStep: Actions.goToPurchaseStep;
    onWebsiteChanged: Actions.changePlotWebsite;
    onBuyoutChanged: Actions.changePlotBuyout;
    onBuyoutEnabledChanged: Actions.changeBuyoutEnabled;
    purchasePlot: Actions.completePlotPurchase;
  },
  contractInfo: ContractInfo;
  plots: Array<PlotInfo>;
  imageData?: string;
  togglePurchaseFlow: () => void;
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
      imageData: this.props.imageData,
      classes: {},
      ...this.props.purchase,
      ...this.props.purchaseActions
    };

    const sideList = (
      <PurchaseFlowCard {...purchaseFlowCardProps} />);
    return (
      <div className={classes.root}>
        <div className={classes.zoom}>
          <ZoomControlComponent classes={{}} scale={this.props.zoomLevel} changeZoom={this.props.changeZoom}/>
        </div>
        {this.props.purchase.purchaseFlowOpen ? null : 
          <Button variant='fab' color="secondary" aria-label="buy plot" className={classes.purchase} onClick={() => this.toggleDrawer()}>
            <ShoppingCart />
          </Button>
        }
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
