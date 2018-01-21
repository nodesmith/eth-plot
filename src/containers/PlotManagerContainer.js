import React, { Component } from 'react';

import PlotManager from '../components/PlotManager';

export default class PlotManagerContainer extends Component {
  render() {
    // Filter data down to just the plots of the current user
    // TODO, using a hardcoded address from test script for UI building.
    const tempAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
    let userPlots = this.props.plots ? this.props.plots.filter((plot) => {
      if (plot.owner === tempAddress) {
        return plot;
      }
    }) : [];

    return (
      <PlotManager 
        userPlots={userPlots} 
        metamaskState={this.props.metamaskSate}
        actions={this.props.actions}
        contractInfo={this.props.contractInfo}
      />
    );
  }
}