import { BigNumber } from 'bignumber.js';
import * as d3Palette from 'd3-scale-chromatic';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Popover from 'material-ui/Popover';
import * as React from 'react';

import * as ActionTypes from '../actions';
import { DragType, MovementActions } from '../constants/Enums';
import { ContractInfo, HoleInfo, ImageFileInfo, PlotInfo, Point, PurchaseEventInfo, Rect, RectTransform } from '../models';

import PlotPopover, { PlotPopoverProps } from './PlotPopover';
import PurchasePlot from './PurchasePlot';


const styles: StyleRulesCallback = theme => ({
  root: {
    padding: 24,
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    userSelect: 'none',
  },
  dragging: {
    cursor: 'grabbing'
  },
  overlay: {
    backgroundColor: '#00000055'
  },
  heatmap: {
    pointerEvents: 'none',
    opacity: 0,
    transition: '.5s ease'
  },
  heatmapShowing: {
    opacity: .95
  },
  svgMap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  svgOverlay: {
    cursor: 'pointer',
    opacity: 0,
    transition: '.5s ease',
    fill: '#FFFFFF',
    '&:hover': {
      opacity: .6
    }
  },
  mainGrid: {
    border: theme.palette.grey['600'],
    borderWidth: 2,
    borderStyle: 'solid'
  }
});

function buildSvgComponents(
  plots: Array<PlotInfo>, plotTransactions: {[plotIndex: number]: PurchaseEventInfo}, holes: HoleInfo, key: string,
  // tslint:disable-next-line:max-line-length
  cb: (plot: PlotInfo, plotTransaction:  PurchaseEventInfo, hole: Array<Rect>, index: number, props: React.SVGAttributes<{}>) => JSX.Element | undefined)
    : JSX.Element[] {
  const result = new Array<JSX.Element>();
  for (let i = 0; i < plots.length; i++) {
    const plot = plots[i];
    const attributes = {
      key: `${key}_${i}`,
      x: plot.rect.x,
      y: plot.rect.y,
      width: plot.rect.w,
      height: plot.rect.h
    };

    const element = cb(plot, plotTransactions[i], holes[i], i, attributes);
    if (element) {
      result.push(element);
    }
  }

  return result;
}

function buildGridSvg(scale: number): JSX.Element[] {
  const result: JSX.Element[] = [];
  const scaledBox = 250 * 1;

  const thin = {
    strokeWidth: `${.5 / scale}px`,
    stroke: 'black'
  };

  const thick = {
    strokeWidth: `${1.5 / scale}px`,
    stroke: 'black'
  };

  // We either have 5, 10, 25, 50, 125, 250 lines to draw
  // The higher scale is, the more lines we'll draw
  const lineEstimate = scale * 20;

  const options = [5, 10, 25, 50, 125, 250];
  let numLines = options[0];
  for (const option of options) {
    if (Math.abs(lineEstimate - option) < Math.abs(lineEstimate - numLines)) {
      numLines = option;
    }
  }

  const jump = 250 / numLines;
  
  for (let i = 0; i <= 250; i += jump) {
    const style = (i % (jump * 5) === 0) ? thick : thin;
    const scaled = i * 1;
    result.push((<line style={style} x1={scaled} x2={scaled} y1={0} y2={scaledBox} key={`vert_${i}`} />));
    result.push((<line style={style} y1={scaled} y2={scaled} x1={0} x2={scaledBox} key={`hori_${i}`} />));
  }

  return result;
}

export interface UIGridProps extends WithStyles {
  plots: Array<PlotInfo>;
  plotTransactions: {[plotIndex: number]: PurchaseEventInfo};
  holes: HoleInfo;
  actions: {
    hoverOverPlot: ActionTypes.hoverOverPlot;
    startTransformRectToPurchase: ActionTypes.startTransformRectToPurchase;
    stopTransformRectToPurchase: ActionTypes.stopTransformRectToPurchase;
    transformRectToPurchase: ActionTypes.transformRectToPurchase;
    loadBlockInfo: ActionTypes.loadBlockInfo;
    reportGridDragging: ActionTypes.reportGridDragging;
    changeZoom: ActionTypes.changeZoom;
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
  centerPoint: Point;
  isDraggingGrid: boolean;

  showHeatmap: boolean;
  showGrid: boolean;
  lowPlotPrice: string;
  highPlotPrice: string;
}

class UIGrid extends React.Component<UIGridProps, {popoverTarget: HTMLElement|undefined, popoverIndex: number}> {
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
    if (index !== 0) {
      this.setState({ popoverTarget: eventTarget, popoverIndex: index }, () => {
        const popoverInfo = this.getPlotPopoverInfo()!;
        this.props.actions.loadBlockInfo(this.props.contractInfo, popoverInfo.purchaseEventInfo.blockNumber);
      });
    }
  }

  plotHovered(index: number, eventTarget: HTMLElement) {
    this.props.actions.hoverOverPlot(index);
  }

  render() {
    const { plots, holes, plotTransactions, scale } = this.props;

    // Gets the svg components for the plots
    const plotRects = buildSvgComponents(plots, plotTransactions, holes, 'img', (plot, plotTransaction, holes, index, props) => {
      return (<image {...props}
        xlinkHref={plot.data.blobUrl}
        preserveAspectRatio="none" />);
    });

    // Gets the svg components for the overlays
    const plotOverlayRects = buildSvgComponents(plots, plotTransactions, holes, 'overlay', (plot, plotTransaction, holes, index, props) => {
      if (index === 0) {
        return undefined;
      }

      return (<rect {...props}
        className={this.props.classes.svgOverlay}
        onClick={(event) => this.plotClicked(plot.zoneIndex, event.target as HTMLElement)}/>);
    });

    // Build up the heatmap, interpolating the colors from the d3Palette
    const minPrice = new BigNumber(this.props.lowPlotPrice);
    const maxPrice = new BigNumber(this.props.highPlotPrice);
    const priceRange = maxPrice.minus(minPrice);
    const heatMapRects = buildSvgComponents(plots, plotTransactions, holes, 'heatmap', (plot, plotTransaction, holes, index, props) => {
      const buyoutPricePerPixelInWeiBN = new BigNumber(plot.buyoutPricePerPixelInWei);

      let color = 'black';
      if (buyoutPricePerPixelInWeiBN.greaterThan(0)) {
        const aboveMin = buyoutPricePerPixelInWeiBN.minus(minPrice);
        const value = new BigNumber(1).minus(aboveMin.div(priceRange));
        color = d3Palette.interpolateRdYlGn(value.toNumber());
      }

      return (<rect {...props}
        fill={color}
        onClick={(event) => this.plotClicked(plot.zoneIndex, event.target as HTMLElement)}/>);
    });

    // Get the svg components for the gridlines
    const gridLines = buildGridSvg(this.props.scale);

    const left = `calc(50vw - ${this.props.centerPoint.x * scale}px)`;
    const top = `calc(50vh - ${this.props.centerPoint.y * scale}px)`;
    const gridStyle: React.CSSProperties = {
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      left,
      top,
      position: 'fixed'
    };

    const overlayStyle: React.CSSProperties = {
      position: 'absolute',
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      left: 0,
      top: 0
    };

    let overlay: JSX.Element | undefined = undefined;
    if (this.props.inPurchaseMode && this.props.imageToPurchase) {

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
        <div className={this.props.classes.overlay}
          style={gridStyle} onMouseMove={this.overlayMouseMove.bind(this)} onMouseUp={this.overlayMouseUp.bind(this)}>
            <PurchasePlot
            classes={{}}
            rect={this.props.rectToPurchase!}
            scale={scale} 
            src={this.props.imageToPurchase.blobUrl}
            startAction={this.onStartAction.bind(this)}
             />
        </div>);
    }

    const plotInfo = this.getPlotPopoverInfo();
    const plotInfoPopover = plotInfo ? <PlotPopover {...plotInfo} /> : null;

    const { classes } = this.props;
    let rootClassName = this.props.classes.root;
    if (this.props.isDraggingGrid) {
      rootClassName += ' ' + classes.dragging;
    }

    return (
      <div className={rootClassName} draggable={true}
        onDragStart={this.onDragStart.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseUp={this.onDragStop.bind(this)}
        onMouseLeave={this.onDragStop.bind(this)}
        
        onWheel={this.onWheel.bind(this)}>

        <div className={classes.mainGrid} style={gridStyle} onMouseOut={this.mouseOut.bind(this)}>
          <svg className={classes.svgMap} viewBox="0 0 250 250">
            {plotRects}
            {plotOverlayRects}
            <g key="heatmap" className={[classes.heatmap, this.props.showHeatmap ? classes.heatmapShowing : ''].join(' ')}>
              {heatMapRects}
            </g>
            <g key="grids" className={[classes.heatmap, this.props.showGrid ? classes.heatmapShowing : ''].join(' ')}>
              {gridLines}
            </g>
          </svg>
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
        </div>
        {overlay}
      </div>
    );
  }

  dragStart: {x: number, y: number} | undefined;
  onDragStart(dragEvent) {
    dragEvent.preventDefault();
    this.props.actions.reportGridDragging(DragType.START, { x: dragEvent.clientX, y: dragEvent.clientY });
  }

  onMouseMove(mouseEvent) {
    if (this.props.isDraggingGrid) {
      this.props.actions.reportGridDragging(DragType.MOVE, { x: mouseEvent.clientX, y: mouseEvent.clientY });
    }
  }

  onDragStop(dragEvent) {
    if (this.props.isDraggingGrid) { 
      this.props.actions.reportGridDragging(DragType.STOP, { x: dragEvent.clientX, y: dragEvent.clientY });
    }
  }

  onWheel(event: WheelEvent): void {
    event.stopPropagation();
    const { clientX, clientY, deltaY, deltaMode } = event;
    this.props.actions.changeZoom(-deltaY / 400);
  }
}

export default withStyles(styles) (UIGrid);
