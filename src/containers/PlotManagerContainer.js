import React, { Component } from 'react';

import PlotManager from '../components/PlotManager';

const testData = [

];

export default class PlotManagerContainer extends Component {
  render() {
    return (
      <PlotManager userPlots={testData} />
    );
  }
}