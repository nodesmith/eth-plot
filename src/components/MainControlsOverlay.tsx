import ShoppingCart from 'material-ui-icons/ShoppingCart';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grow from 'material-ui/transitions/Grow';
import Slide from 'material-ui/transitions/Slide';
import Zoom from 'material-ui/transitions/Zoom';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as Actions from '../actions';
import { ContractInfo, ImageFileInfo, InputValidation, PlotInfo, Rect } from '../models';

import PurchaseFlowCard, { PurchaseFlowCardProps } from './PurchaseFlowCard';
import PurchaseToolbar from './PurchaseToolbar';
import ZoomControl from './ZoomControl';

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
    // marginTop: '64px',
    width: 400,
    pointerEvents: 'all'
  },
  filterCard: {
    position: 'fixed',
    width: '500px',
    left: 'calc(50% - 250px)',
    // right: 24,
    bottom: 24
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
  };
  purchaseActions: {
    onImageSelected: Actions.purchaseImageSelected;
    onStepComplete: Actions.completePurchaseStep;
    goToStep: Actions.goToPurchaseStep;
    onWebsiteChanged: Actions.changePlotWebsite;
    onBuyoutChanged: Actions.changePlotBuyout;
    onBuyoutEnabledChanged: Actions.changeBuyoutEnabled;
    purchasePlot: Actions.completePlotPurchase;
  };
  contractInfo: ContractInfo;
  plots: Array<PlotInfo>;
  togglePurchaseFlow: () => void;
}

class MainControlsOverlay extends Component<MainControlsOverlayProps, {purchaseEntered: boolean}> {
  constructor(props: MainControlsOverlayProps, context?: any) {
    super(props, context);

    this.state = {
      purchaseEntered: false
    };
  }
  toggleDrawer() {
    this.props.togglePurchaseFlow();
  }

  render() {
    const { classes } = this.props;

    const purchaseFlowCardProps = {
      onClose: () => this.toggleDrawer(),
      contractInfo: this.props.contractInfo,
      plots: this.props.plots,
      classes: {},
      ...this.props.purchase,
      ...this.props.purchaseActions
    };

    const sideList = (
      <PurchaseFlowCard {...purchaseFlowCardProps} />);
    return (
      <div className={classes.root}>
        {/* <div className={classes.zoom}>
          <ZoomControl classes={{}} scale={this.props.zoomLevel} changeZoom={this.props.changeZoom}/>
        </div> */}
        <Zoom in={!this.props.purchase.purchaseFlowOpen}> 
          <Button variant="fab" aria-label="buy plot" className={classes.purchase} onClick={() => this.toggleDrawer()}>
            <ShoppingCart />
          </Button>
        </Zoom>
        <Drawer classes={{
          paper: classes.drawer
        }}
          anchor="right"
          variant="persistent"
          open={this.props.purchase.purchaseFlowOpen}
          onClose={() => this.toggleDrawer()}>
          {sideList}
        </Drawer>
        <Slide direction="left" in={this.props.purchase.purchaseFlowOpen && false}
          onEntered={() => this.setState({ purchaseEntered: true })}
          onExiting={() => this.setState({ purchaseEntered: false })} > 
          <div className={classes.filterCard}>
            <PurchaseToolbar
              currentPrice={this.props.purchase.purchasePriceInWei}
              classes={{}}
              plots={this.props.plots}
              onImageSelected={this.props.purchaseActions.onImageSelected}
              entered={this.state.purchaseEntered}
              onClose={() => this.toggleDrawer()}
              onCheckout={() => this.toggleDrawer()}/>
          </div>
        </Slide>
        
        {/* <Snackbar open={this.props.purchase.purchaseFlowOpen} >
          <PurchaseToolbar currentPrice={'23432'} />
        </Snackbar> */}
      </div>
    );
  }
}

export default withStyles(styles)(MainControlsOverlay);
