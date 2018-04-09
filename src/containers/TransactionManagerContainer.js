import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TransactionManager from '../components/TransactionManager';

class TransactionManagerContainer extends Component {
  render() {
    // We want to sort the transactions by how they happened chronologically,
    // which we can just use the block number to do.
    let comparator = (tx1, tx2) => {
      if (tx1.blockNumber < tx2.blockNumber) return 1;
      else if (tx1.blockNumber === tx2.blockNumber) return 0;
      else return -1;
    }

    const transactionArray = Object.values(this.props.userTransactions);
    const sortedTransactions = transactionArray.concat().sort(comparator);

    return (
      <TransactionManager 
        metamaskState={this.props.metamaskState}
        userTransactions={sortedTransactions}
      />
    );
  }
}

TransactionManagerContainer.propTypes = {
  metamaskState: PropTypes.number.isRequired,
  userTransactions: PropTypes.object.isRequired,
};

export default TransactionManagerContainer;