import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PurchasePlot extends Component {
  mouseOver() {
    this.props.hoverAction(this.props.index);
  }

  plotClicked(e) {
    e.stopPropagation();
    
    // The plot has been clicked. We should go ahead and try to buy this plot
    this.props.startPurchase(this.props.rect);
  }


  overlayMouseDown(e) {
    // const scale = this.props.scale;
    // const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    // const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
    // this.props.actions.startDraggingRect(Math.round(x / scale), Math.round(y / scale));
    // e.stopPropagation();
  }

  overlayMouseMove(e) {
    // const scale = this.props.scale;
    // const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    // const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
    // this.props.actions.resizeDraggingRect(Math.round(x / scale), Math.round(y / scale));
    // e.stopPropagation();
  }

  overlayMouseUp(e) {
    // this.props.actions.stopDraggingRect();
    // e.stopPropagation();
  }

  render() {
    const rect = this.props.rect;
    const scale = this.props.scale;
    const plotStyle = {
      top: 0,
      left: 0,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'grab'
    };

    const wrapperStyle = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute'
    };

    const tooltipStyle = {
      top: -40
    }

    const handleWidth = 10;
    const leftStyle = {
      top: 0,
      left: 0 - (handleWidth * .5),
      width: handleWidth,
      height: rect.h * scale,
      position: 'absolute',
      cursor: 'ew-resize'
    }

    const rightStyle = Object.assign({}, leftStyle, {
      left: (rect.w * scale) - (handleWidth * .5)
    });

    const topStyle = {
      top: 0 - (handleWidth * .5),
      left: 0,
      width: rect.w * scale,
      height: handleWidth,
      position: 'absolute',
      cursor: 'ns-resize'
    };

    const bottomStyle = Object.assign({}, topStyle, {
      top: (rect.h * scale) - (handleWidth * .5)
    })

    const upperLeftStyle = {
      top: -handleWidth,
      left: -handleWidth,
      width: handleWidth * 2,
      height: handleWidth * 2,
      position: 'absolute',
      cursor: 'nwse-resize'
    };

    const upperRightStyle = Object.assign({}, upperLeftStyle, {
      left: (rect.w * scale) - handleWidth,
      cursor: 'nesw-resize'
    });

    const lowerRightStyle = Object.assign({}, upperLeftStyle, {
      left: (rect.w * scale) - handleWidth,
      top: (rect.h * scale) - handleWidth
    });

    const lowerLeftStyle = Object.assign({}, upperLeftStyle, {
      top: (rect.h * scale) - handleWidth,
      cursor: 'nesw-resize'
    });

    const tooltipText = `${rect.w} x ${rect.h}`;

    return (
      <div style={wrapperStyle} >
        <div style={plotStyle} 
          className="purchasePlot"
          onMouseDown={this.overlayMouseDown.bind(this)}
          onMouseMove={this.overlayMouseMove.bind(this)}
          onMouseUp={this.overlayMouseUp.bind(this)}>
        </div>
        <div style={leftStyle} />
        <div style={rightStyle} />
        <div style={topStyle} />
        <div style={bottomStyle} />
        <div style={upperLeftStyle} />
        <div style={upperRightStyle} />
        <div style={lowerRightStyle} />
        <div style={lowerLeftStyle} />
        <div className='purchaseTooltip' style={tooltipStyle}>
          <span>{tooltipText}</span>
        </div>
      </div>
    );
  }
}

PurchasePlot.propTypes = {
  rect: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired
};