import React, { Component } from 'react';

import './App.css';
import 'web3';
import { MockPlotDataRepository } from './data/MockPlotDataRepository';

import { generatePlots, /*getOffset*/ } from './helpers/grid-helpers'

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // We need to get access to the data provider here
    let provider = null;
    if (this.props.provider === 'mock') {
      // We're going to user the mock provider here
      provider = new MockPlotDataRepository();
    } else {
      // We're going to use the real provider. TODO
      throw new Error('Not implemented yet')
    }

    provider.initializeAsync().then(() => {
      return provider.loadAllPlotsAsync();
    }).then((plots) => {
      this.setState({
        plots: plots,
        isLoading: false
      })
    });

    this.setState({
      provider: new MockPlotDataRepository(),
      isLoading: true
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">eth grid</h1>
        </header>
        
        <PlotGrid plots={this.state.plots} clickHandler={this.updatePlot.bind(this)}/>
      </div>
    );
  }
}

export default App;
