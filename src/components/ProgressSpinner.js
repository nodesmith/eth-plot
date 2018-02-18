import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
  progress: {
    
  },
  container: { // Used to center the spinner
    position: "fixed",
    zIndex: 999,
    height: "2em",
    width: "2em",
    overflow: "show",
    margin: "auto",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});

function ProgressSpinner(props) {
  const { classes } = props;
  return (
    <div className={classes.container} >
      <CircularProgress className={classes.progress} size={50} />
    </div>
  );
}

ProgressSpinner.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressSpinner);