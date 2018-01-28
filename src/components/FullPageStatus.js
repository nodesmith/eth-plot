import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography/Typography';

class FullPageStatus extends Component {
  render() {
    return (
      <div className="plot-warning" >
        <Typography gutterBottom type='subheading'>
          <i>{this.props.message}</i>
        </Typography>
      </div>
    );
  }
}

FullPageStatus.propTypes = {
  message: PropTypes.string.isRequired
};

export default FullPageStatus;