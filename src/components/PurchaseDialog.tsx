import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button from 'material-ui/Button/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { PurchaseStage } from '../constants/Enums';

// The stages here are used to calculate the progress bar, so this 
// list does not account for every corresponding stage in the PurchaseStage Enum,
// but only the set of stages that have a visual representation in the purchase dialog.
const stages = [
  PurchaseStage.NOT_STARTED,
  PurchaseStage.UPLOADING_TO_IPFS,
  PurchaseStage.WAITING_FOR_UNLOCK,
  PurchaseStage.SUBMITTING_TO_BLOCKCHAIN,
  PurchaseStage.USER_CONFIRM];

const styles: StyleRulesCallback = theme => ({
});

export interface PurchaseDialogProps extends WithStyles {
  isShowing: boolean;
  purchaseStage: number;
  closePlotPurchase: () => void;
}


class PurchaseDialog extends React.Component<PurchaseDialogProps> {
  handleClose() {
    this.props.closePlotPurchase();
  }

  getMessage(purchaseStage) {
    switch (purchaseStage) {
      case PurchaseStage.NOT_STARTED:
        return 'Starting Purchase Process';
      case PurchaseStage.UPLOADING_TO_IPFS:
        return (<span>Uploading image data to <a target="_blank" href="https://ipfs.io/">IPFS</a></span>);
      case PurchaseStage.WAITING_FOR_UNLOCK:
        return 'Waiting for user to sign transaction in MetaMask';
      case PurchaseStage.SUBMITTING_TO_BLOCKCHAIN:
        return 'Submitting transaction to the Ethereum network';
      case PurchaseStage.USER_CONFIRM:
        return `Your purchase transaction has been submitted to the Ethereum network.  
                Your plot will be visible on the grid once the transaction has been mined.  
                You can check the status of your transaction in the "My Transactions" page.`;
      case PurchaseStage.ERROR:
        return 'The transaction was rejected or an unexpected error has occurred.  Your purchase transaction was not submitted to the network. ';
      default:
        return null;
    }
  }

  render() {
    const { classes, isShowing, purchaseStage } = this.props;
    if (!isShowing) {
      return null;
    }

    const currentStageIndex = stages.indexOf(purchaseStage) || 0;
    const progressPercentage = (currentStageIndex / (stages.length - 1));
    const progress = Math.round(progressPercentage * 100);
    const bufferProgress = Math.min(100, progress + 7);

    const message = this.getMessage(purchaseStage);

    const purchaseCompleteOrErrored = (purchaseStage === PurchaseStage.USER_CONFIRM || purchaseStage === PurchaseStage.ERROR);

    return (
      <Dialog disableBackdropClick={true} fullWidth maxWidth="xs" aria-labelledby="dialog-title" open={true}>
        <DialogTitle id="dialog-title">Purchasing Plot</DialogTitle>
        <DialogContent>
          {(purchaseStage !== PurchaseStage.ERROR) ?
            (<LinearProgress variant="buffer" value={progress} valueBuffer={bufferProgress} />)
          : null}
          <br />
          <Typography variant="subheading" align="left">
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          {(purchaseCompleteOrErrored) ?
           (<Button onClick={this.handleClose.bind(this)}>
              Okay
            </Button>)
          : null}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(PurchaseDialog);
