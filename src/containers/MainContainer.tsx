import * as React from 'react';
import MainControlsOverlay from '../components/MainControlsOverlay';
import PurchaseDialog from '../components/PurchaseDialog';

import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import UIGrid, { UIGridProps } from '../components/UIGrid';
import * as Enums from '../constants/Enums';
import { ImageFileInfo, PlotInfo, GridInfo, Rect } from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    position: 'relative',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 54px)',
    },
    userDrag: 'none'
  }
});

export interface MainContainerProps extends WithStyles {
  actions: any; // TODO
  purchase: any; // TODO
  imageFileInfo: ImageFileInfo;
  plots: Array<PlotInfo>;
  scale: number;
  gridInfo: GridInfo;
  hoveredIndex: number;
  dragRectCurr: Rect;
  dragRectStart: Rect;
  isDraggingRect: boolean;
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
      purchasePlot: this.props.actions.completePlotPurchase
    };

    const uiGridProps: UIGridProps = {
      actions: {
        hoverOverPlot: this.props.actions.hoverOverPlot,
        startTransformRectToPurchase: this.props.actions.startTransformRectToPurchase,
        stopTransformRectToPurchase: this.props.actions.stopTransformRectToPurchase,
        transformRectToPurchase: this.props.actions.transformRectToPurchase
      },
      classes: {},
      inPurchaseMode: this.props.purchase.purchaseFlowOpen,
      currentTransform: this.props.purchase.currentTransform,
      imageToPurchase: this.props.imageFileInfo,
      rectToPurchase: this.props.purchase.rectToPurchase,
      plots: this.props.plots,
      scale: this.props.scale,
      gridInfo: this.props.gridInfo,
      hoveredIndex: this.props.hoveredIndex,
      dragRectCurr: this.props.dragRectCurr,
      dragRectStart: this.props.dragRectStart,
      isDraggingRect: this.props.isDraggingRect
    };

    const uiGridActions = {
      hoverOverPlot: this.props.actions.hoverOverPlot,
      startTransformRectToPurchase: this.props.actions.startTransformRectToPurchase,
      stopTransformRectToPurchase: this.props.actions.stopTransformRectToPurchase,
      transformRectToPurchase: this.props.actions.transformRectToPurchase
    }

    return (
      <div className={this.props.classes.root}> 
        <UIGrid {...uiGridProps} />
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
