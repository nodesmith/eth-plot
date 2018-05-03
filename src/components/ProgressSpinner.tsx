import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { CircularProgress } from 'material-ui/Progress';

const styles: StyleRulesCallback = theme => ({
  container: { // Used to center the spinner
    position: 'fixed',
    zIndex: 999,
    height: '2em',
    width: '2em',
    overflow: 'visible',
    margin: 'auto',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});

export interface ProgressSpinnerProps extends WithStyles {

}

class ProgressSpinner extends React.Component<ProgressSpinnerProps> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container} >
        <CircularProgress size={50} />
      </div>
    );
  }
}

export default withStyles(styles)(ProgressSpinner);
