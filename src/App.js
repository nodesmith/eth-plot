import React, { Component } from 'react';
import $ from "jquery";

import './App.css';
import { PixelGridContainer } from './components/PixelGridContainer';
import { generateGrid, getOffset} from './helpers/grid-helpers'

const pixelSize = 40;
const gridSize = 10;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pixels: generateGrid(gridSize)
    }
  }
  updatePixel(i) {
    const canvas = document.getElementsByTagName("canvas")[0];
    const x = i.pageX - canvas.offsetLeft;
    const y = i.pageY - canvas.offsetTop;

    const pixelToUpdate = getOffset(x, y, gridSize, pixelSize); 
    let newPixels = this.state.pixels;
    newPixels[pixelToUpdate] = "#000000";
    this.setState({pixels: newPixels})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">eth grid</h1>
        </header>
        <div id="gridRoot" />
        <PixelGridContainer data={this.state.pixels} size={pixelSize} clickHandler={this.updatePixel.bind(this)}/>
      </div>
    );
  }
}

export default App;
