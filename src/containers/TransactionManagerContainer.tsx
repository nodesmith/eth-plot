import * as React from 'react';

import TransactionManager from '../components/TransactionManager';
import { UserTransactions } from '../models';

export interface TransactionManagerContainerProps {
  metamaskState: number;
  userTransactions: { [hash: string]: UserTransactions };
}

class TransactionManagerContainer extends React.Component<TransactionManagerContainerProps> {
  render() {
    // We want to sort the transactions by how they happened chronologically,
    // which we can just use the block number to do.
    const comparator = (tx1, tx2) => {
      if (tx1.blockNumber < tx2.blockNumber) return 1;
      else if (tx1.blockNumber === tx2.blockNumber) return 0;
      else return -1;
    };

    const transactionArray = Object.values(this.props.userTransactions);
    const sortedTransactions = transactionArray.concat().sort(comparator);

    return (
      <TransactionManager 
        metamaskState={this.props.metamaskState}
        userTransactions={sortedTransactions}
        classes={{}}
      />
    );
  }
}

export default TransactionManagerContainer;
