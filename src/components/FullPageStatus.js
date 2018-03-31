import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  container: {
    paddingTop: 30,
    textAlign: "center"
  }
});

class FullPageStatus extends Component {
  render() {
    return (
      <div className={this.props.classes.container} >
        <Typography gutterBottom type='subheading'>
          {this.props.message}
        </Typography>
      </div>
    );
  }
}

FullPageStatus.propTypes = {
  message: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullPageStatus);