import React, { Component } from 'react';

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
  message: React.PropTypes.string.isRequired
};

export default FullPageStatus;