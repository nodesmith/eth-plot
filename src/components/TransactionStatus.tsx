import AddCircle from 'material-ui-icons/AddCircle';
import AttachMoney from 'material-ui-icons/AttachMoney';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import { Component } from 'react';
import * as React from 'react';

import * as Enums from '../constants/Enums';
import { UserTransactions } from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    padding: 16
  }
});

export interface TransactionStatusProps extends WithStyles {
  tx: UserTransactions;
}

class TransactionStatus extends Component<TransactionStatusProps> {
  getTxStatus() {
    let colorClass;
    let statusText;
    
    switch (this.props.tx.txStatus) {
      case Enums.TxStatus.SUCCESS:
        colorClass = 'primary';
        statusText = 'Success';
        break;
      case Enums.TxStatus.FAILED:
        colorClass = 'error';
        statusText = 'Failed';
        break;
      case Enums.TxStatus.PENDING:
        colorClass = undefined;
        statusText = 'Pending';
        break;
      default:
        throw 'unknown tx status type';
    }

    return <Typography variant="subheading" color={colorClass}>{statusText}</Typography>;
  }

  render() {
    const etherscanUrl = `https://etherscan.io/tx/${this.props.tx.txHash}`;
    const isAuction = (this.props.tx.txType === Enums.TxType.AUCTION);

    // TODO, this component should contain a more info dropdown with the summary
    // of each transaction.
    const txTextComponent = (isAuction) ? 'Auction Update Transaction' : 'Purchase Transaction';
    const txStatusComponent = this.getTxStatus();

    return (
      <Grid className={this.props.classes.root} container alignItems="center" >
        <Grid item xs>
          <Avatar>
            {(isAuction) ?
            (<AttachMoney />) :
            (<AddCircle />)}
          </Avatar>
        </Grid>
        
        <Grid item xs={6} sm={8} md={10} >
          <Grid container spacing={8} wrap="nowrap">
            <Grid item xs={12} zeroMinWidth>
              <Typography>{txTextComponent}</Typography>
              <Typography noWrap><a href={etherscanUrl}>{this.props.tx.txHash}</a></Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs>
          {txStatusComponent}
        </Grid>
      </Grid>
    );
  }
}


export default withStyles(styles)(TransactionStatus);
