import React, { Component, PropTypes } from 'react';

export default class RectImage extends Component {

  getRenderedRect(key, rect) {
    const scale = this.props.height / this.props.baseRect.h;
    const rectStyle = {
      height: rect.h * scale,
      width: rect.w * scale,
      left: rect.x * scale,
      top: rect.y * scale,
      position: 'absolute',
      backgroundColor: rect.color
    };

    return (<div key={key} style={rectStyle}></div>);
  }

  render() {
    if (Math.abs((this.props.height / this.props.width) - (this.props.baseRect.h /this.props.baseRect.w)) > .01) {
      throw new Error('baseRect and height / width are not same dimension');
    }

    const rootStyle = {
      height: this.props.height,
      width: this.props.width,
      position: 'relative'
    };

    const baseRects = [this.getRenderedRect('base', this.props.baseRect)];
    const layeredRects = this.props.subRects.map((subRect, index) => this.getRenderedRect(index, subRect));
    const allRects = baseRects.concat(layeredRects);

    return (
    <div style={rootStyle}>
      {allRects}
    </div>);
  }
}

RectImage.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  baseRect: PropTypes.object.isRequired,
  subRects: PropTypes.array.isRequired
}