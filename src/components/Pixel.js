import React, { Component } from 'react';

export class Pixel extends React.Component {
  render() {
    return <h1>{this.props.x}, {this.props.y}</h1>
  }
}