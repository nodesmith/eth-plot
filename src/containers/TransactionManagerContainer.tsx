import * as React from 'react';

import TransactionManager from '../components/TransactionManager';
import { UserTransaction } from '../models';

export interface TransactionManagerContainerProps {
  metamaskState: number;
  userTransactions: { [hash: string]: UserTransaction[] };
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

    // Because there can be multiple transactions for each txHash 
    // (the case where a user buys a plot or plots from themeselves), we flatten
    // the each list into one flat transactions list.
    const flattenedTransactions: UserTransaction[] = [];
    Object.values(this.props.userTransactions).forEach((transactions: UserTransaction[]) => {
      transactions.forEach((tx: UserTransaction) => {
        flattenedTransactions.push(tx);
      });
    });
    
    const sortedTransactions = flattenedTransactions.concat().sort(comparator);

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
