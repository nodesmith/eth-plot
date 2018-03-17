import * as ActionTypes from '../constants/ActionTypes';
import * as DataActions from '../actionCreators/DataActions';
import * as Enums from '../constants/Enums';

export function updateMetamaskState(newState) {
  return {
    type: ActionTypes.UPDATE_METAMASK_STATE,
    newState
  };
}

export function updateActiveAccount(newActiveAccount) {
  return {
    type: ActionTypes.UPDATE_ACTIVE_ACCOUNT,
    newActiveAccount
  };
}

// This action adds a new transaction to the list of transactions of the user.
// This can either be a newly created transaction, or a previous transaction that
// is stored on chain.  isNew should be true when adding a newly created transaction,
// and false when reading a transaction from the chain.
export function addTransaction(txHash, txType, txStatus, blockNumber, isNew) {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    txHash,
    txType,
    txStatus,
    blockNumber,
    isNew
  };
}

export function clearNotificationCount() {
  return {
    type: ActionTypes.CLEAR_NOTIFICATION_COUNT
  }
}

export function loadTransactions() {
  return {
    type: ActionTypes.LOAD_TRANSACTIONS
  };
}

export function doneLoadingTransactions() {
  return {
    type: ActionTypes.LOAD_TRANSACTIONS_DONE
  };
}

export function fetchAccountTransactions(contractInfo) {
  return function (dispatch) {
    dispatch(loadTransactions());

    const contract = DataActions.initializeContract(contractInfo);

    const auctionEventPromise = new Promise((resolve, reject) => {
      const auctionUpdatedEvent = contract.AuctionUpdated({}, {fromBlock: 1, toBlock: 'latest'});

      auctionUpdatedEvent.get((err, data) => {
        if (err) reject(err);
  
        data.forEach(tx => {
          // Since the auction update is called for new purchases as well as an actual update
          // to an existing price, we use this flag to determine if we should show this transaction
          // from a UI standpoint as an "update price" transaction.
          if (!tx.args.newPurchase) {
            const txStatus = DataActions.determineTxStatus(tx);
            dispatch(addTransaction(tx.transactionHash, Enums.TxType.AUCTION, txStatus, tx.blockNumber, false));
          }
        });

        resolve();
      });
    }); 
    
    const purchaseEventPromise = new Promise((resolve, reject) => {
      const purchaseEvent = contract.PlotPurchased({}, {fromBlock: 1, toBlock: 'latest'});
      purchaseEvent.get((err, data) => {
        if (err) reject(err);
  
        data.forEach(tx => {
          const txStatus = DataActions.determineTxStatus(tx);
          dispatch(addTransaction(tx.transactionHash, Enums.TxType.PURCHASE, txStatus, tx.blockNumber, false));
        });
      });
      resolve();
    }); 

    Promise.all([auctionEventPromise, purchaseEventPromise]).then(values => { 
      dispatch(doneLoadingTransactions());
    });
  }
}
