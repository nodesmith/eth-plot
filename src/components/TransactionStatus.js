import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Enums from '../constants/Enums';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AddCircle from 'material-ui-icons/AddCircle';
import AttachMoney from 'material-ui-icons/AttachMoney';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    padding: 16
  }
});

class TransactionStatus extends Component {
  getTxStatus() {
    let colorClass;
    let statusText;
    
    switch (this.props.tx.txStatus) {
      // TODO clean up colors
      case Enums.TxStatus.SUCCESS:
        colorClass = 'primary';
        statusText = 'Success';
        break;
      case Enums.TxStatus.FAILED:
        colorClass = 'error';
        statusText = 'Failed';
        break;
      case Enums.TxStatus.PENDING:
        colorClass = 'secondary';
        statusText = 'Pending';
        break;
      default:
        throw 'unknown tx status type';
    }

    return <Typography type="subheading" color={colorClass}>{statusText}</Typography>
  }

  render() {
    const etherscanUrl = `https://etherscan.io/tx/${this.props.tx.txHash}`;
    const isAuction = (this.props.tx.txType === Enums.TxType.AUCTION);

    // TODO, this component should contain a more info dropdown with the summary
    // of each transaction.
    const txTextComponent = (isAuction) ? "Auction Update Transaction" : "Purchase Transaction";
    const txStatusComponent = this.getTxStatus();

    return (
      <ListItem>
        <Avatar>
          {(isAuction) ?
          (<AttachMoney />) :
          (<AddCircle />)}
        </Avatar>
        <ListItemText primary={txTextComponent} secondary={<a href={etherscanUrl}>{this.props.tx.txHash}</a>} />
        {txStatusComponent}
      </ListItem>
    );
  }
}

TransactionStatus.propTypes = {
  tx: PropTypes.object.isRequired
};

export default withStyles(styles)(TransactionStatus);