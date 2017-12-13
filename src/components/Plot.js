import React, { Component } from 'react'

import { getPlotStyle } from '../helpers/grid-helpers'

export class Plot extends Component {
  render() {
    const style = getPlotStyle(this.props.plot)
    return (
      <div
        onMouseDown={() => this.props.onMouseDown(this.props.id)}
        onMouseUp={() => this.props.onMouseUp(this.props.id)}
        onMouseOver={() => this.props.onMouseOver(this.props.id)}
        style={style}
      />
    )
  }
}