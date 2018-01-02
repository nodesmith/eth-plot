import React, { Component, PropTypes } from 'react';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class GridPlot extends Component {
  render() {
    const rect = this.props.plot.ownership;
    const scale = this.props.scale;
    const plotStyle = {
      top: rect.y * scale,
      left: rect.x * scale,
      width: rect.w * scale,
      height: rect.h * scale,
      backgroundColor: getRandomColor()
    };

    return (
      <div key={this.props.index} style={plotStyle} className="gridPlot">
        
      </div>
    );
  }
}

GridPlot.propTypes = {
  plot: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired
};