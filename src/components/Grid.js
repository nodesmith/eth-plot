import React, { Component, PropTypes } from 'react';

import GridPlot from './GridPlot';

export default class Grid extends Component {
  mouseOut() {
    // Reset the hover once the mouse leaves this area
    this.props.actions.hoverOverPlot(-1);
  }

  render() {
    const scale = 3; // TODO - do something based off the viewport width

    const plots = this.props.plots.map((plot, index) => {
      return (<GridPlot scale={scale} plot={plot} index={index} isHovered={this.props.hoveredIndex === index} hoverAction={this.props.actions.hoverOverPlot} />);
    });

    const gridStyle = {
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative',
      cursor: 'pointer'
    }

    return (
      <div className="gridSection">
        <div style={gridStyle} className="grid" onMouseOut={this.mouseOut.bind(this)}>
          {plots}
        </div>
      </div>
    );
  }
}

Grid.propTypes = {
  plots: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};