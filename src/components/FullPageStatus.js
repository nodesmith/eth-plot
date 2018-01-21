import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FullPageStatus extends Component {
  render() {
    return (
      <div className="plot-warning" >
      <h4><i>{this.props.message}</i></h4>
      </div>  
    );
  }
}

FullPageStatus.propTypes = {
  message: PropTypes.string.isRequired
};

export default FullPageStatus;