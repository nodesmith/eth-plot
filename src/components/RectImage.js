import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SVGRectImageBuilder {
  constructor(height, width, baseRect, subRects) {
    this.height = height;
    this.width = width;
    this.baseRect = baseRect;
    this.subRects = subRects;
  }

  getRect(key, rect) {
    return `<rect x='${rect.x}' y='${rect.y}' width='${rect.w}' height='${rect.h}' stroke='${rect.color}' fill='${rect.color}'></rect>`;
  }

  output() {
    const baseRects = [this.getRect('base', this.baseRect)];
    const layeredRects = this.subRects.map((subRect, index) => this.getRect(index, subRect));
    const allRects = baseRects.concat(layeredRects);

    const viewBox = `${this.baseRect.x}, ${this.baseRect.y}, ${this.baseRect.w}, ${this.baseRect.h}`;
    const result = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox='${viewBox}' height='${this.height}' width='${this.width}' >
      ${allRects.join('\n')}
    </svg>`;

    return result;
  }
}

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