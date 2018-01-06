import React, { Component, PropTypes } from 'react';

export default class GridPlot extends Component {
  mouseOver() {
    this.props.hoverAction(this.props.index);
  }

  render() {
    const rect = this.props.plot.rect;
    const scale = this.props.scale;
    const plotStyle = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      backgroundColor: this.props.plot.color
    };

    if (this.props.isHovered) {
      plotStyle.outlineColor = '#fff';
      plotStyle.outlineWidth = '1px';
      plotStyle.outlineStyle = 'solid';
    }

    return (
      <a href={this.props.plot.data.url}
        target='blank' key={this.props.index}
        style={plotStyle}
        className="gridPlot"
        onMouseOver={this.mouseOver.bind(this)}>
      </a>
    );
  }
}

GridPlot.propTypes = {
  plot: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  hoverAction: PropTypes.func.isRequired,
  isHovered: PropTypes.bool.isRequired
};