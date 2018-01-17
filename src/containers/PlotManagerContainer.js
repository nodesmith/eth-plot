import React, { Component } from 'react';
import Web3 from 'web3';

import PlotManager from '../components/PlotManager';

let web3Provider;

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
      <PlotManager userPlots={userPlots} web3Initialized={
        (typeof web3 !== 'undefined')
      } actions={this.props.actions} contractInfo={this.props.contractInfo}/>
    );
  }
}