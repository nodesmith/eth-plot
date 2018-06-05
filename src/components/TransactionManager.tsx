import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as React from 'react';

import { UserTransaction } from '../models';

import TransactionStatus from './TransactionStatus';

const styles: StyleRulesCallback = theme => ({
  root: {
    paddingTop: 24,
    paddingBottom: 16
  },
  title: {
    paddingBottom: 20
  }
});

export interface TransactionManagerProps extends WithStyles {
  userTransactions: Array<UserTransaction>;
  metamaskState: number;
  activeAccount: string;
  getEtherscanUrl: (txHash: string) => string;
}

class TransactionManager extends React.Component<TransactionManagerProps> {
  getUserContent() {
    const pendingTransactions = this.props.userTransactions.map((tx, index) => {
      return (
        <Grid key={index} item xs={9} >
          <Paper>
            <TransactionStatus classes={{}} tx={tx} getEtherscanUrl={this.props.getEtherscanUrl} />
          </Paper>
        </Grid>
      );
    });

    return [
      (<Grid key="title" item xs={9} className={this.props.classes.title} >
        <Typography align="center" variant="headline" gutterBottom>My Transactions</Typography>
        <Typography align="center" variant="caption"><b>Account: </b>{this.props.activeAccount}</Typography>
      </Grid>),
      pendingTransactions
    ];
  }

  render() {
    const content = this.getUserContent();
    
    return (
      <Grid container className={this.props.classes.root} justify="center" spacing={0} >
        {content}
        {(this.props.userTransactions.length === 0) ? 
          <Typography variant="subheading">There are no Eth Plot transactions associated with this account.</Typography>
          : null
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(TransactionManager);
