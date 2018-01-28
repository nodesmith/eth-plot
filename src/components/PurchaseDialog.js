import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Dialog, { DialogActions, DialogTitle, DialogContent } from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography/Typography';
import Button from 'material-ui/Button/Button';
import { PurchaseStage } from '../constants/Enums';

const stages = [
  PurchaseStage.NOT_STARTED,
  PurchaseStage.UPLOADING_TO_IPFS,
  PurchaseStage.SAVING_TO_CLOUD,
  PurchaseStage.WAITING_FOR_UNLOCK,
  PurchaseStage.SUBMITTING_TO_BLOCKCHAIN,
  PurchaseStage.WAITING_FOR_CONFIRMATIONS,
  PurchaseStage.DONE ];

const styles = theme => ({
});

class PurchaseDialog extends Component {
  constructor(...args) {
    super(...args);
  }

  handleCancel() {
    this.props.cancelPlotPurchase();
  }

  getMessage(purchaseStage) {
    switch(purchaseStage) {
      case PurchaseStage.NOT_STARTED:
        return 'Starting Purchase Process';
      case PurchaseStage.UPLOADING_TO_IPFS:
        return (<span>Uploading image data to <a target='_blank' href=''>IPFS</a></span>);
      case PurchaseStage.SAVING_TO_CLOUD:
        return (<span>Saving to <a target='_blank' href=''>AWS</a></span>);
      case PurchaseStage.WAITING_FOR_UNLOCK:
        return 'Waiting for wallet to unlock';
      case PurchaseStage.SUBMITTING_TO_BLOCKCHAIN:
        return 'Submitting transaction to the Ethereum network';
      case PurchaseStage.WAITING_FOR_CONFIRMATIONS:
        return 'Waiting for confirmations';
      default:
        return null;
    }
  }

  render() {
    const { classes, isShowing, purchaseStage } = this.props;
    if (!isShowing) {
      return null;
    }

    const currentStageIndex = stages.indexOf(purchaseStage);
    const progressPercentage = (currentStageIndex / (stages.length - 1));
    const progress = Math.round(progressPercentage * 100);
    const bufferProgress = Math.min(100, progress + 7);

    const message = this.getMessage(purchaseStage);

    return (
      <Dialog disableBackdropClick fullWidth maxWidth='xs' aria-labelledby="dialog-title" open={true}>
        <DialogTitle id="dialog-title">Purchasing Plot</DialogTitle>
        <DialogContent>
          <LinearProgress mode="buffer" value={progress} valueBuffer={bufferProgress} />
          <br />
          <Typography type='subheading' align='left'>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel.bind(this)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

PurchaseDialog.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  purchaseStage: PropTypes.number.isRequired,
  cancelPlotPurchase: PropTypes.func.isRequired
};

export default withStyles(styles)(PurchaseDialog);
