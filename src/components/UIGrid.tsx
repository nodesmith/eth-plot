import { Paper } from 'material-ui';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Popover from 'material-ui/Popover';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as ActionTypes from '../actions';
import { MovementActions } from '../constants/Enums';
import { ContractInfo, ImageFileInfo, PlotInfo as PlotInfoModel, Point, PurchaseEventInfo, Rect, RectTransform } from '../models';

import GridPlot from './GridPlot';
import PlotPopover, { PlotPopoverProps } from './PlotPopover';
import PurchasePlot from './PurchasePlot';

const styles: StyleRulesCallback = theme => ({
  root: {
    padding: 24,
    width: '100%',
    height: '100%',
    overflow: 'scroll'
  }
});

export interface UIGridProps extends WithStyles {
  plots: Array<PlotInfoModel>;
  plotTransactions: {[plotIndex: number]: PurchaseEventInfo};
  actions: {
    hoverOverPlot: ActionTypes.hoverOverPlot;
    startTransformRectToPurchase: ActionTypes.startTransformRectToPurchase;
    stopTransformRectToPurchase: ActionTypes.stopTransformRectToPurchase;
    transformRectToPurchase: ActionTypes.transformRectToPurchase;
    loadBlockInfo: ActionTypes.loadBlockInfo;
  };
  inPurchaseMode: boolean;
  imageToPurchase?: ImageFileInfo;
  currentTransform?: RectTransform;
  rectToPurchase?: Rect;
  scale: number;
  gridInfo: {
    width: number;
    height: number;
  };
  hoveredIndex: number;
  dragRectCurr?: Point;
  dragRectStart?: Point;
  isDraggingRect: boolean;
  contractInfo: ContractInfo;
}

class UIGrid extends Component<UIGridProps, {popoverTarget: HTMLElement|undefined, popoverIndex: number}> {
  constructor(props: UIGridProps, context?: any) {
    super(props, context);

    this.state = { popoverTarget: undefined, popoverIndex: -1 };
  }
  mouseOut() {
    // Reset the hover once the mouse leaves this area
    this.props.actions.hoverOverPlot(-1);
  }

  onStartAction(x, y, action) {
    this.props.actions.startTransformRectToPurchase({ x, y }, action);
  }

  overlayMouseUp(e) { 
    this.props.actions.stopTransformRectToPurchase();
  } 

  overlayMouseMove(e) { 
    if (!this.props.currentTransform) {
      return;
    }

    const scale = this.props.scale; 
    const x = (e.clientX - e.currentTarget.getBoundingClientRect().x) / scale; 
    const y = (e.clientY - e.currentTarget.getBoundingClientRect().y) / scale;

    const deltaX = x - this.props.currentTransform.startLocation.x;
    const deltaY = y - this.props.currentTransform.startLocation.y;

    // tslint:disable-next-line:one-variable-per-declaration
    let top = 0, left = 0, bottom = 0, right = 0;

    const rect = Object.assign({}, this.props.rectToPurchase);
    switch (this.props.currentTransform.transformAction) {
      case MovementActions.DRAG:
        left = right = deltaX;
        top = bottom = deltaY;
        break;
      case MovementActions.TOP:
        top = deltaY;
        break;
      case MovementActions.LEFT:
        left = deltaX;
        break;
      case MovementActions.BOTTOM:
        bottom = deltaY;
        break;
      case MovementActions.RIGHT:
        right = deltaX;
        break;
      case MovementActions.UPPER_LEFT:
        top = deltaY;
        left = deltaX;
        break;
      case MovementActions.LOWER_LEFT:
        bottom = deltaY;
        left = deltaX;
        break;
      case MovementActions.LOWER_RIGHT:
        bottom = deltaY;
        right = deltaX;
        break;
      case MovementActions.UPPER_RIGHT:
        right = deltaX;
        top = deltaY;
        break;
    }

    top = Math.round(top);
    left = Math.round(left);
    bottom = Math.round(bottom);
    right = Math.round(right);

    this.props.actions.transformRectToPurchase({ top, left, bottom, right }, this.props.plots);

    e.stopPropagation(); 
  }

  getPlotPopoverInfo() : PlotPopoverProps | undefined {
    if (this.state.popoverIndex > 0) {
      const plotInfo = this.props.plots[this.state.popoverIndex];
      return {
        plot: plotInfo,
        purchaseEventInfo: this.props.plotTransactions[plotInfo.zoneIndex],
        classes:{}
      };
    }
  }

  plotClicked(index: number, eventTarget: HTMLElement) {
    this.setState({ popoverTarget: eventTarget, popoverIndex: index }, () => {
      const popoverInfo = this.getPlotPopoverInfo()!;
      this.props.actions.loadBlockInfo(this.props.contractInfo, popoverInfo.purchaseEventInfo.blockNumber);
    });

  }

  plotHovered(index: number, eventTarget: HTMLElement) {
    this.props.actions.hoverOverPlot(index);
  }

  render() {
    const scale = this.props.scale;

    const plots = this.props.plots.map((plot, index) => {
      return (<GridPlot scale={scale} plot={plot} ipfsHash={plot.data.ipfsHash} index={index} isHovered={this.props.hoveredIndex === index}
        hoverAction={this.plotHovered.bind(this)} key={index} classes={{}}
        clickAction={this.plotClicked.bind(this)} />);
    });

    const marginLeft = `calc(calc(100vw - ${this.props.gridInfo.width * scale}px) / 2)`;
    const gridStyle: React.CSSProperties = {
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      marginLeft,
      position: 'absolute'
    };

    let overlay: JSX.Element | undefined = undefined;
    if (this.props.inPurchaseMode && this.props.imageToPurchase) {
      const overlayStyle: React.CSSProperties = {
        width: this.props.gridInfo.width * scale,
        height: this.props.gridInfo.height * scale,
        marginLeft,
        position: 'absolute'
      };

      let purchasePlotRect: Rect | undefined;
      if (this.props.dragRectCurr && this.props.dragRectStart) {
        purchasePlotRect = {
          x: Math.min(this.props.dragRectCurr.x, this.props.dragRectStart.x),
          y: Math.min(this.props.dragRectCurr.y, this.props.dragRectStart.y),
          w: Math.abs(this.props.dragRectCurr.x - this.props.dragRectStart.x),
          h: Math.abs(this.props.dragRectCurr.y - this.props.dragRectStart.y),
          x2: 0,
          y2: 0
        };

        purchasePlotRect.x2 = purchasePlotRect.x + purchasePlotRect.w;
        purchasePlotRect.y2 = purchasePlotRect.y + purchasePlotRect.h;

        if (!this.props.isDraggingRect && purchasePlotRect.w === 0 && purchasePlotRect.h === 0) {
          purchasePlotRect = undefined;
        }
      }

      overlay = (
        <div style={overlayStyle} onMouseMove={this.overlayMouseMove.bind(this)} onMouseUp={this.overlayMouseUp.bind(this)}>
            <PurchasePlot
            classes={{}}
            rect={this.props.rectToPurchase!}
            scale={scale} 
            src={this.props.imageToPurchase.fileData}
            startAction={this.onStartAction.bind(this)}
             />
        </div>);
    }

    const plotInfo = this.getPlotPopoverInfo();
    const plotInfoPopover = plotInfo ? <PlotPopover {...plotInfo} /> : null;

    return (
      <div className={this.props.classes.root}>
        <Paper style={gridStyle} onMouseOut={this.mouseOut.bind(this)}>
          {plots}
          <Popover
            open={Boolean(this.state.popoverTarget) && this.state.popoverIndex !== 0}
            anchorEl={this.state.popoverTarget!}
            onClose={() => this.setState({ popoverTarget: undefined })}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}>
            {plotInfoPopover}
          </Popover>
        </Paper>
        {overlay}
      </div>
    );
  }
}

export default withStyles(styles)(UIGrid);
