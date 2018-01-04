import React, { Component, PropTypes } from 'react';

export default class PurchasePlot extends Component {
  mouseOver() {
    this.props.hoverAction(this.props.index);
  }

  render() {
    const rect = this.props.rect;
    const scale = this.props.scale;
    const plotStyle = {
      top: 0,
      left: 0,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute'
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

    const tooltipText = `${rect.w} x ${rect.h}`;

    return (
      <div style={wrapperStyle}>
        <div style={plotStyle} className="purchasePlot"></div>
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