import React, { Component } from 'react';

import { Pixel } from './Pixel';

const pixels = [];

export class Grid extends React.Component {
  componentDidMount() {
    for (var i = 0; i < this.props.width; i++) {
      for (var j = 0; j < this.props.height; j++) {
        pixels.push(<Pixel x={i} y={j}/>);
      }
    }
  };

  render() {
    return (
      <div>
      {pixels}
      </div>
    );
  }
}