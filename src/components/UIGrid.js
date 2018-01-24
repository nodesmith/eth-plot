import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MovementActions } from '../constants/Enums';

import GridPlot from './GridPlot';
import PurchasePlot from './PurchasePlot';

import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    padding: 24,
    width: '100%',
    height: '100%',
    overflow: 'scroll'
  }
});


class UIGrid extends Component {
  constructor(...args) {
    super(...args);
  }

  mouseOut() {
    // Reset the hover once the mouse leaves this area
    this.props.actions.hoverOverPlot(-1);
  }

  onStartAction(x, y, action) {
    this.props.actions.startTransformRectToPurchase({x, y}, action);
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

    let top = 0, left = 0, bottom = 0, right = 0;

    let rect = Object.assign({}, this.props.rectToPurchase);
    switch(this.props.currentTransform.transformAction) {
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
        bottom: deltaY;
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

    this.props.actions.transformRectToPurchase({top, left, bottom, right});

    // console.log(rect);
    e.stopPropagation(); 
  }
  

  render() {
    const scale = this.props.scale;

    const plots = this.props.plots.map((plot, index) => {
      return (<GridPlot scale={scale} plot={plot} index={index} isHovered={this.props.hoveredIndex === index} hoverAction={this.props.actions.hoverOverPlot} key={index} />);
    });

    const marginLeft = `calc(calc(100vw - ${this.props.gridInfo.width * scale}px) / 2)`;
    const gridStyle = {
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      marginLeft: marginLeft,
      position: 'absolute'
    };

    let overlay = null;
    if (this.props.inPurchaseMode && this.props.imageToPurchase) {
      const overlayStyle = {
        width: this.props.gridInfo.width * scale,
        height: this.props.gridInfo.height * scale,
        marginLeft: marginLeft,
        position: 'absolute'
      };

      let purchasePlotRect = null;
      if (this.props.dragRectCurr && this.props.dragRectStart) {
        purchasePlotRect = {
          x: Math.min(this.props.dragRectCurr.x, this.props.dragRectStart.x),
          y: Math.min(this.props.dragRectCurr.y, this.props.dragRectStart.y),
          w: Math.abs(this.props.dragRectCurr.x - this.props.dragRectStart.x),
          h: Math.abs(this.props.dragRectCurr.y - this.props.dragRectStart.y)
        };

        purchasePlotRect.x2 = purchasePlotRect.x + purchasePlotRect.w;
        purchasePlotRect.y2 = purchasePlotRect.y + purchasePlotRect.h;

        if (!this.props.isDraggingRect && purchasePlotRect.w === 0 && purchasePlotRect.h === 0) {
          purchasePlotRect = null;
        }
      }

      overlay = (
        <div style={overlayStyle} onMouseMove={this.overlayMouseMove.bind(this)} onMouseUp={this.overlayMouseUp.bind(this)}>
            <PurchasePlot 
            rect={this.props.rectToPurchase}
            scale={scale} 
            src={this.props.imageToPurchase.fileData}
            startAction={this.onStartAction.bind(this)}
             />
          {/* {
            purchasePlotRect ? <PurchasePlot
              startPurchase={this.props.actions.showPurchaseDialog}
              scale={scale}
              rect={purchasePlotRect} /> : null
          } */}
        </div>);
    }

    return (
      <div className={this.props.classes.root}>
        <div style={gridStyle} className="grid" onMouseOut={this.mouseOut.bind(this)}>
          {plots}
        </div>
        {overlay}
      </div>
    );
  }
}

UIGrid.propTypes = {
  plots: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  inPurchaseMode: PropTypes.bool.isRequired,
  imageToPurchase: PropTypes.object.isRequired,
  currentTransform: PropTypes.object.isRequired
};

export default withStyles(styles)(UIGrid);
