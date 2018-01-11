import React, { Component, PropTypes } from 'react';

export default class RectImage extends Component {

  getRenderedRect(key, rect) {
    return (<rect key={key} x={rect.x} y={rect.y} width={rect.w} height={rect.h} stroke={rect.color} fill={rect.color}></rect>);
  }

  render() {
    if (Math.abs((this.props.height / this.props.width) - (this.props.baseRect.h /this.props.baseRect.w)) > .01) {
      throw new Error('baseRect and height / width are not same dimension');
    }

    const svgStyle = {
      marginLeft: 'auto',
      marginRight: 'auto'
    };

    const baseRects = [this.getRenderedRect('base', this.props.baseRect)];
    const layeredRects = this.props.subRects.map((subRect, index) => this.getRenderedRect(index, subRect));
    const allRects = baseRects.concat(layeredRects);

    const viewBox = `${this.props.baseRect.x}, ${this.props.baseRect.y}, ${this.props.baseRect.w}, ${this.props.baseRect.h}`;

    return (
    <div className='rectImage'>
      <svg style={svgStyle} viewBox={viewBox} height={this.props.height} width={this.props.width}>
        {allRects}
      </svg>
    </div>);
  }
}

RectImage.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  baseRect: PropTypes.object.isRequired,
  subRects: PropTypes.array.isRequired
}