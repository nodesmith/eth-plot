import React, { Component } from 'react';
// import $ from "jquery";

import './App.css';
import { generatePlots, /*getOffset*/ } from './helpers/grid-helpers'

// import { PixelGrid } from './components/PixelGrid';
import { PlotGrid } from './components/PlotGrid';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      plots: generatePlots()
    }
  }
  updatePlot(i) {
    console.log(i);
    /*
    const canvas = document.getElementsByTagName("canvas")[0];
    const x = i.pageX - canvas.offsetLeft;
    const y = i.pageY - canvas.offsetTop;

    const pixelToUpdate = getOffset(x, y, gridSize, pixelSize); 
    let newPixels = this.state.pixels;
    newPixels[pixelToUpdate] = "#000000";
    this.setState({pixels: newPixels})*/
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
