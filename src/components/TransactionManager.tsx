import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as Enums from '../constants/Enums';
import { UserTransaction } from '../models';

import PlotInfo from './PlotInfo';
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
}

class TransactionManager extends React.Component<TransactionManagerProps> {
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

    return [
      (<Grid key="title" item xs={9}>
        <Typography className={this.props.classes.title} align="center" variant="headline" >My Transactions</Typography>
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
          <Typography variant="subheading">There are no Eth Grid transactions associated with this account.</Typography>
          : null
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(TransactionManager);
