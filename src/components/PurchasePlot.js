import React, { Component, PropTypes } from 'react';

export default class PurchasePlot extends Component {
  mouseOver() {
    this.props.hoverAction(this.props.index);
  }

  render() {
    const rect = this.props.rect;
    const scale = this.props.scale;
    const plotStyle = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      position: 'absolute'
    };

    return (
      <div style={plotStyle}
        className="purchasePlot">
      </div>
    );
  }
}

PurchasePlot.propTypes = {
  rect: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired
};