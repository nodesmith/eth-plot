import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';

import * as Enums from '../constants/Enums';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';

import MetaMaskStatus from './MetaMaskStatus';
import PendingTransaction from './PendingTransaction';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  notificationContent: {
    marginTop: 40
  },
  txList: {
    padding: 12
  }
});

class TransactionManager extends Component {
  getUserContent() {
    const pendingTransactions = this.props.pendingTxs.map((tx, index) => {
      return (
        <Grid item xs={12}>
          <Paper>
            <PendingTransaction txHash={tx.txHash} txType={tx.txType} />
          </Paper>
        </Grid>
      );
    });

    if (pendingTransactions.length == 0) {
      pendingTransactions.push(
        <Grid item xs={12} >
          <p><i>There are currently no pending transactions for this account.</i></p>
        </Grid>
      )
    }

    return [
      (<Grid id="asdf" item xs={8} className={this.props.classes.notificationContent}>
        <Typography type='title' >Pending Transactions</Typography>
      </Grid>),
      (<List className={this.props.classes.txList}>
        {pendingTransactions}
      </List>)
    ]
  }

  render() {
    return (
      (this.props.metamaskState != Enums.METAMASK_STATE.OPEN) ?
      <MetaMaskStatus metamaskState={this.props.metamaskState} />
      :
      <Grid container className={this.props.classes.root} justify="center" >
        <Grid item xs={9} >
          <Grid container spacing={24} >
            {content}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

TransactionManager.propTypes = {
  metamaskState: PropTypes.number.isRequired,
  pendingTxs: PropTypes.array.isRequired,
};

export default withStyles(styles)(TransactionManager);