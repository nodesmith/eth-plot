import React, { Component } from 'react';

import { Plot } from './Plot';

import { getGridStyle } from '../helpers/grid-helpers'

export class PlotGrid extends Component {
  constructor(props) {
    super(props)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
  }
  handleMouseUp() {
    // todo
  }
  handleMouseDown(id) {
    // todo
  }
  handleMouseOver(id) {
    // todo
  }
  render() {
    // TODO not ordered yet
    const style = getGridStyle(this.props.plot)    
    return (
      <div className="grid-container" style={style}>
        {this.props.plots.map((plot, i) => (
          <Plot
            key={i}
            plot={plot}
            id={i}
            onMouseUp={(id) => this.handleMouseUp(id)}
            onMouseDown={(id) => this.handleMouseDown(id)}
            onMouseOver={(id) => this.handleMouseOver(id)}
          />
        ))}
      </div>
    );
  }
}