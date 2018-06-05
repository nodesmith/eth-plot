import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as Actions from '../actions';
import MainControlsOverlay, { MainControlsOverlayProps } from '../components/MainControlsOverlay';
import PurchaseDialog from '../components/PurchaseDialog';
import UIGrid, { UIGridProps } from '../components/UIGrid';
import {
  ContractInfo,
  GridInfo,
  HoleInfo,
  ImageFileInfo,
  InputValidation,
  PlotInfo,
  Point,
  PurchaseEventInfo,
  Rect,
  RectTransform,
} from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    position: 'relative',
    height: 'calc(100vh - 0px)',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 0px)',
    },
    userDrag: 'none'
  }
});


export interface MainContainerProps extends WithStyles, RouteComponentProps<any> {
  actions: {
    purchaseImageSelected: Actions.purchaseImageSelected,
    goToPurchaseStep: Actions.goToPurchaseStep,
    completePurchaseStep: Actions.completePurchaseStep,
    changePlotWebsite: Actions.changePlotWebsite,
    changePlotBuyout: Actions.changePlotBuyout,
    changeBuyoutEnabled: Actions.changeBuyoutEnabled,
    completePlotPurchase: Actions.completePlotPurchase,
    hoverOverPlot: Actions.hoverOverPlot,
    startTransformRectToPurchase: Actions.startTransformRectToPurchase,
    stopTransformRectToPurchase: Actions.stopTransformRectToPurchase,
    transformRectToPurchase: Actions.transformRectToPurchase,
    togglePurchaseFlow: Actions.togglePurchaseFlow;
    changeZoom: Actions.changeZoom;
    loadBlockInfo: Actions.loadBlockInfo;
    reportGridDragging: Actions.reportGridDragging;
    toggleShowHeatmap: Actions.toggleShowHeatmap;
    toggleShowGrid: Actions.toggleShowGrid;
  };
  purchase: {
    rectToPurchase?: Rect;
    purchasePriceInWei: string;
    activeStep: number;
    completedSteps: {[index: number]: boolean};
    allowedFileTypes: string[];
    currentTransform: RectTransform | undefined;
    imageDimensions: {
      h: number;
      w: number;
    }
    website: string;
    buyoutPricePerPixelInWei?: string;
    buyoutEnabled: boolean;
    purchaseFlowOpen: boolean;
    imageValidation: InputValidation;
    showHeatmap: boolean;
    showGrid : boolean;
  };
  imageFileInfo?: ImageFileInfo;
  plots: Array<PlotInfo>;
  plotTransactions: {[plotIndex: number]: PurchaseEventInfo};
  holes: HoleInfo;
  contractInfo: ContractInfo;
  scale: number;
  gridInfo: GridInfo;
  centerPoint: Point;
  isDraggingGrid: boolean;
  hoveredIndex: number;
  dragRectCurr?: Point;
  dragRectStart?: Point;
  isDraggingRect: boolean;
  purchaseDialog: {
    resetPurchaseFlow: Actions.resetPurchaseFlow;
    closePlotPurchase: Actions.closePlotPurchase;
    purchaseStage: number;
    isShowing: boolean;
  };
  activeAccount: string;
  lowPlotPrice: string | undefined;
  highPlotPrice: string | undefined;
  getEtherscanUrl: (txHash: string) => string;
}

class MainContainer extends React.Component<MainContainerProps> {
  render() {
    const purchaseActions = {
      onImageSelected: this.props.actions.purchaseImageSelected,
      goToStep: this.props.actions.goToPurchaseStep,
      onStepComplete: this.props.actions.completePurchaseStep,
      onWebsiteChanged: this.props.actions.changePlotWebsite,
      onBuyoutChanged: this.props.actions.changePlotBuyout,
      onBuyoutEnabledChanged: this.props.actions.changeBuyoutEnabled,
      purchasePlot: this.props.actions.completePlotPurchase,
      toggleShowHeatmap: this.props.actions.toggleShowHeatmap,
      toggleShowGrid: this.props.actions.toggleShowGrid
    };

    const uiGridProps: UIGridProps = {
      actions: {
        hoverOverPlot: this.props.actions.hoverOverPlot,
        startTransformRectToPurchase: this.props.actions.startTransformRectToPurchase,
        stopTransformRectToPurchase: this.props.actions.stopTransformRectToPurchase,
        transformRectToPurchase: this.props.actions.transformRectToPurchase,
        loadBlockInfo: this.props.actions.loadBlockInfo,
        reportGridDragging: this.props.actions.reportGridDragging,
        changeZoom: this.props.actions.changeZoom
      },
      classes: {},
      inPurchaseMode: this.props.purchase.purchaseFlowOpen,
      currentTransform: this.props.purchase.currentTransform,
      imageToPurchase: this.props.imageFileInfo,
      rectToPurchase: this.props.purchase.rectToPurchase,
      plots: this.props.plots,
      plotTransactions: this.props.plotTransactions,
      holes: this.props.holes,
      scale: this.props.scale,
      gridInfo: this.props.gridInfo,
      centerPoint: this.props.centerPoint,
      isDraggingGrid: this.props.isDraggingGrid,
      hoveredIndex: this.props.hoveredIndex,
      dragRectCurr: this.props.dragRectCurr,
      dragRectStart: this.props.dragRectStart,
      isDraggingRect: this.props.isDraggingRect,
      contractInfo: this.props.contractInfo,
      showHeatmap: this.props.purchase.showHeatmap && this.props.purchase.activeStep === 1 && this.props.purchase.purchaseFlowOpen,
      showGrid: this.props.purchase.showGrid && this.props.purchase.activeStep === 1 && this.props.purchase.purchaseFlowOpen,
      lowPlotPrice: this.props.lowPlotPrice || '0',
      highPlotPrice: this.props.highPlotPrice || '0',
      getEtherscanUrl: this.props.getEtherscanUrl
    };

    const mainControlsOverlayProps: MainControlsOverlayProps = {
      classes: {},
      purchase: Object.assign(this.props.purchase, { imageFileInfo: this.props.imageFileInfo }),
      zoomLevel: this.props.scale,
      purchaseActions,
      contractInfo: this.props.contractInfo,
      plots: this.props.plots,
      togglePurchaseFlow: this.props.actions.togglePurchaseFlow,
      changeZoom: this.props.actions.changeZoom,
      activeAccount: this.props.activeAccount,
      scale: this.props.scale,
      centerPoint: this.props.centerPoint,
      showHeatmap: this.props.purchase.showHeatmap && this.props.purchase.activeStep === 1 && this.props.purchase.purchaseFlowOpen,
      lowPlotPrice: this.props.lowPlotPrice || '0',
      highPlotPrice: this.props.highPlotPrice || '0',
    };

    return (
      <div className={this.props.classes.root}> 
        <UIGrid {...uiGridProps} />
        <MainControlsOverlay {...mainControlsOverlayProps} />
        <PurchaseDialog {...this.props.purchaseDialog} classes={{}} />
      </div>
    );
  }
}

export default withStyles(styles)(MainContainer);
