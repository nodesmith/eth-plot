import React, { Component } from 'react'
var grid = require('pixel-grid')

// Not currently in use by mighti still be needed depending on 
// our editing UI.  Leaving here for now.
export class PixelGrid extends Component {
  componentDidMount() {
    grid = grid(this.props.data, {
      root: document.getElementById("gridRoot"),
      size: this.props.size,
      padding: 0
    })

    grid.canvas.onclick = this.props.clickHandler;

    this.setState({
      grid: grid
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.state && this.state.grid) {
      this.state.grid.update(nextProps.data);
    }
  }
  render() {
    return (
      <div id="gridRoot" />
    )
  }
}