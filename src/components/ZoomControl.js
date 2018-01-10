import React, { Component, PropTypes } from 'react';

export default class ZoomControl extends Component {

  zoomIn() {
    this.props.changeZoom(+1);
  }

  zoomOut() {
    this.props.changeZoom(-1);
  }

  render() {
    const size = 25;
    const style = {
      height: size,
      width: size,
      cursor: 'pointer',
      backgroundColor: 'lightgray'
    };

    const iconStyle = {
      width: size,
      height: size,
    };

    return (
    <div>
      <div onClick={this.zoomIn.bind(this)} style={style}>
        <img style={iconStyle} src='./assets/ic_add_black_24px.svg' />
      </div>
      <div style={{height: 10}}>
        {this.props.scale}
      </div>
      <div onClick={this.zoomOut.bind(this)} style={style}>
        <img style={iconStyle} src='./assets/ic_remove_black_24px.svg' />
      </div>
    </div>);
  }
}

ZoomControl.propTypes = {
  scale: PropTypes.number.isRequired,
  changeZoom: PropTypes.func.isRequired
}