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

import TransactionStatus from './TransactionStatus';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
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
            <TransactionStatus txHash={tx.txHash} txType={tx.txType} />
          </Paper>
        </Grid>
      );
    });

    if (pendingTransactions.length == 0) {
      pendingTransactions.push(
        <Grid item xs={12} >
          <Typography type="subheading">There have been no transactions for this account.</Typography>
        </Grid>
      )
    }

    return [
      (<Grid id="asdf" item xs={8}>
        <Typography type='title' >My Transactions</Typography>
      </Grid>),
      (<List className={this.props.classes.txList}>
        {pendingTransactions}
      </List>)
    ]
  }

  render() {
    const content = this.getUserContent();
    return (
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
  pendingTxs: PropTypes.array.isRequired,
};

export default withStyles(styles)(TransactionManager);