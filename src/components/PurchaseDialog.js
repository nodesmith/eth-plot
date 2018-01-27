import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';

const styles = theme => ({
});

class PurchaseDialog extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    const { classes, isShowing } = this.props;
    if (!isShowing) {
      return null;
    }

    return (
      <Dialog aria-labelledby="dialog-title" open={true}>
        <DialogTitle id="dialog-title">Purchasing Plot</DialogTitle>
        <DialogContent>
          Hello
        </DialogContent>
      </Dialog>
    )
  }
}

PurchaseDialog.propTypes = {
  isShowing: PropTypes.bool.isRequired
};

export default withStyles(styles)(PurchaseDialog);
