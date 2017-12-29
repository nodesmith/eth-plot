import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class MainGrid extends Component {
  constructor(propTypes) {
    super(propTypes);
  }

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

MainGrid.propTypes = {
  editingInfo: PropTypes.any,
  ownershipInfo: PropTypes.array,
  ownershipDepth: PropTypes.number
}
