import React, { Component } from 'react';
import Web3 from 'web3';

import PlotManager from '../components/PlotManager';

const testData = [

];

let web3Provider;

export default class PlotManagerContainer extends Component {
  render() {
    return (
      <PlotManager userPlots={testData} web3Initialized={
        (typeof web3 !== 'undefined')
      } />
    );
  }
}