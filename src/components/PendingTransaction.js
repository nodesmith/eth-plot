import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    padding: 16
  }
});

class PendingTransaction extends Component {
  render() {
    const etherscanUrl = `https://etherscan.io/tx/${this.props.txHash}`;

    return (
      <Grid className={this.props.classes.root} container spacing={24}>
        <a href={etherscanUrl}>{this.props.txHash}</a>
      </Grid>
    );
  }
}

PendingTransaction.propTypes = {
  txHash: PropTypes.string.isRequired,
  txType: PropTypes.number.isRequired,
};

export default withStyles(styles)(PendingTransaction);