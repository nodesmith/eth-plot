import React, { Component } from 'react';
import Web3 from 'web3';

import PlotManager from '../components/PlotManager';

const testData = [

];

let web3Provider;

export default class PlotManagerContainer extends Component {
  constructor() {
    super();
    web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
  }

  render() {
    return (
      <PlotManager userPlots={testData} />
    );
  }
}