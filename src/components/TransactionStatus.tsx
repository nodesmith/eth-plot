import AddCircle from 'material-ui-icons/AddCircle';
import AttachMoney from 'material-ui-icons/AttachMoney';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import * as React from 'react';

import * as Enums from '../constants/Enums';
import { UserTransaction } from '../models';

const styles: StyleRulesCallback = theme => ({
  root: {
    padding: 16
  },
  headerText: {
    paddingBottom: 4
  }
});

export interface TransactionStatusProps extends WithStyles {
  tx: UserTransaction;
  getEtherscanUrl: (txHash: string) => string;
}

class TransactionStatus extends React.Component<TransactionStatusProps> {
  getTxStatusComponent(): JSX.Element {
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
    const etherscanUrl = this.props.getEtherscanUrl(this.props.tx.txHash);
    const txStatusComponent = this.getTxStatusComponent();

    let txText: string;
    let txIcon: JSX.Element;

    switch (this.props.tx.txType) {
      case Enums.TxType.AUCTION:
        txText = 'You change the price of your plot';
        txIcon = <SwapHoriz />;
        break;
      case Enums.TxType.PURCHASE:
        txText = 'You bought a plot';
        txIcon = <AddCircle />;
        break;
      case Enums.TxType.SALE:
        txText = 'Someone bought a portion of your plot';
        txIcon = <AttachMoney />;
        break;
      default:
        throw `Unknown transaction type: ${this.props.tx.txType}`;
    }

    return (
      <Grid className={this.props.classes.root} container alignItems="center" >
        <Grid item xs>
          <Avatar>
            { txIcon }
          </Avatar>
        </Grid>
        
        <Grid item xs={6} sm={8} md={10} >
          <Grid container spacing={8} wrap="nowrap">
            <Grid item xs={12} zeroMinWidth>
              <Typography className={this.props.classes.headerText}>{txText}</Typography>
              <Typography noWrap><a target="_blank" href={etherscanUrl}>{this.props.tx.txHash}</a></Typography>
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
