import React, { Component, PropTypes } from 'react';

import GridPlot from './GridPlot';

export default class Grid extends Component {
  render() {
    const scale = 3; // TODO - do something based off the viewport width

    const plots = this.props.plots.map((plot, index) => {
      return (<GridPlot scale={scale} plot={plot} index={index} />);
    });

    const gridStyle = {
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative'
    }

    return (
      <div className="gridSection">
        <div style={gridStyle} className="grid">
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