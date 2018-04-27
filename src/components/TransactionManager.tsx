import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import * as Enums from '../constants/Enums';
import { UserTransactions } from '../models';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';
import TransactionStatus from './TransactionStatus';

const styles: StyleRulesCallback = theme => ({
  root: {
    marginTop: 20,
    paddingBottom: 16
  }
});

export interface TransactionManagerProps extends WithStyles {
  userTransactions: Array<UserTransactions>;
  metamaskState: number;
}

class TransactionManager extends Component<TransactionManagerProps> {
  getUserContent() {
    const pendingTransactions = this.props.userTransactions.map((tx, index) => {
      return (
        <Grid key={index} item xs={9} >
          <Paper>
            <TransactionStatus classes={{}} tx={tx} />
          </Paper>
        </Grid>
      );
    });

    if (pendingTransactions.length === 0) {
      pendingTransactions.push(
        <Grid key="no-data" item xs={9} >
          <Typography variant="subheading">There have been no transactions for this account.</Typography>
        </Grid>
      );
    }

    return [
      (<Grid key="title" item xs={9}>
        <Typography variant="title" >My Transactions</Typography>
      </Grid>),
      pendingTransactions
    ];
  }

  render() {
    const content = this.getUserContent();
    return (
      <Grid container className={this.props.classes.root} justify="center" spacing={16} >
       {content}
      </Grid>
    );
  }
}

export default withStyles(styles)(TransactionManager);
