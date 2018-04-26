import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button from 'material-ui/Button/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import { PurchaseStage } from '../constants/Enums';

const stages = [
  PurchaseStage.NOT_STARTED,
  PurchaseStage.UPLOADING_TO_IPFS,
  PurchaseStage.SAVING_TO_CLOUD,
  PurchaseStage.WAITING_FOR_UNLOCK,
  PurchaseStage.SUBMITTING_TO_BLOCKCHAIN,
  PurchaseStage.WAITING_FOR_CONFIRMATIONS,
  PurchaseStage.DONE];

const styles: StyleRulesCallback = theme => ({
});

export interface PurchaseDialogProps extends WithStyles {
  isShowing: boolean;
  purchaseStage: number;
  cancelPlotPurchase: () => void;
}


class PurchaseDialog extends Component<PurchaseDialogProps> {
  handleCancel() {
    this.props.cancelPlotPurchase();
  }

  getMessage(purchaseStage) {
    switch (purchaseStage) {
      case PurchaseStage.NOT_STARTED:
        return 'Starting Purchase Process';
      case PurchaseStage.UPLOADING_TO_IPFS:
        return (<span>Uploading image data to <a target="_blank" href="">IPFS</a></span>);
      case PurchaseStage.SAVING_TO_CLOUD:
        return (<span>Saving to <a target="_blank" href="">AWS</a></span>);
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
      <Dialog disableBackdropClick={true} fullWidth maxWidth="xs" aria-labelledby="dialog-title" open={true}>
        <DialogTitle id="dialog-title">Purchasing Plot</DialogTitle>
        <DialogContent>
          <LinearProgress variant="buffer" value={progress} valueBuffer={bufferProgress} />
          <br />
          <Typography variant="subheading" align="left">
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel.bind(this)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(PurchaseDialog);
