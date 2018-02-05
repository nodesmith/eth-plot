import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';

import * as Enums from '../constants/Enums';

import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';
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
});


class AccountManager extends Component {
  getFullPageStatus() {
    if (this.props.metamaskState === Enums.METAMASK_STATE.OPEN) {
      return (<FullPageStatus message="You don't have any owned plots. Visit the grid to purchase a plot." />);
    } else {
      return (
        <MetaMaskStatus metamaskState={this.props.metamaskState} />
      );
    }
  }

  getUserContent() {
    const plotInfos = this.props.userPlots.map((plot, index) => {
      return (
        <Grid item xs={12}>
          <Paper>
            <PlotInfo info={plot} key={index} actions={this.props.actions} contractInfo={this.props.contractInfo} />
          </Paper>
        </Grid>
      );
    });

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
        <h4>There are currently no pending transactions for this account.</h4>
      )
    }

    return [
      (<Grid item xs={8}>
        <Typography type='title'>My Content</Typography>
      </Grid>),
      plotInfos,
      (<Grid item xs={8} className={this.props.classes.notificationContent}>
        <Typography type='title' >Pending Transactions</Typography>
      </Grid>),
      pendingTransactions
    ]
  }

  render() {
    let content = this.props.metamaskState !== Enums.METAMASK_STATE.OPEN || this.props.userPlots.length === 0 ? 
      this.getFullPageStatus() :
      this.getUserContent();

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

AccountManager.propTypes = {
  userPlots: PropTypes.array.isRequired,
  metamaskState: PropTypes.number.isRequired,
  pendingTxs: PropTypes.array.isRequired,
};

export default withStyles(styles)(AccountManager);