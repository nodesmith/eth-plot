import * as DataActions from '../actionCreators/DataActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';

import { Action } from './EthGridAction';

export function updateMetamaskState(newState: Enums.METAMASK_STATE): Action {
  return {
    type: ActionTypes.UPDATE_METAMASK_STATE,
    newState
  };
}

export function updateActiveAccount(newActiveAccount): Action {
  return {
    type: ActionTypes.UPDATE_ACTIVE_ACCOUNT,
    newActiveAccount
  };
}

// This action adds a new transaction to the list of transactions of the user.
// This can either be a newly created transaction, or a previous transaction that
// is stored on chain.  isNew should be true when adding a newly created transaction,
// and false when reading a transaction from the chain.
export function addTransaction(txHash, txType, txStatus, blockNumber, isNew): Action {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    txHash,
    txType,
    txStatus,
    blockNumber,
    isNew
  };
}

export function clearNotificationCount(): Action {
  return {
    type: ActionTypes.CLEAR_NOTIFICATION_COUNT
  };
}

export function loadTransactions(): Action {
  return {
    type: ActionTypes.LOAD_TRANSACTIONS
  };
}

export function doneLoadingTransactions(): Action {
  return {
    type: ActionTypes.LOAD_TRANSACTIONS_DONE
  };
}

export function fetchAccountTransactions(contractInfo, currentAddress) {
  return function (dispatch) {
    dispatch(loadTransactions());

    const newWeb3 = DataActions.getWeb3(contractInfo);
    const contract = DataActions.initializeContract(contractInfo);
    
    const auctionEventPromise = new Promise((resolve, reject) => {
      // The owner filter here only fetches events where the owner is the current address, allowing
      // us to perform that filter on the "server" side.  
      // TODO: do we need some form of paging when a single user has a ton of transactions?
      const auctionUpdatedEvent = contract.AuctionUpdated({ owner: currentAddress }, { fromBlock: 1, toBlock: 'latest' });

      // Get's historical auction transactions for loading user's transaction list
      auctionUpdatedEvent.get((err, data) => {
        if (err) reject(err);

        data.forEach(tx => {
          auctionTransactionHandler(tx, false, Enums.TxType.AUCTION, dispatch);
        });
      });

      // Listens to incoming auction transnactions
      auctionUpdatedEvent.watch((err, data) => {
        if (err) reject(err);
        auctionTransactionHandler(data, true, Enums.TxType.AUCTION, dispatch);
      });

      resolve();
    }); 
    
    const purchaseEventPromise = new Promise((resolve, reject) => {
      const purchaseEvent = contract.PlotPurchased({ buyer: currentAddress }, { fromBlock: 1, toBlock: 'latest' });

      // Get's historical purchase transactions for loading user's transaction list
      purchaseEvent.get((err, data) => {
        if (err) reject(err);

        data.forEach(tx => {
          genericTransactionHandler(tx, false, Enums.TxType.PURCHASE, dispatch);
        });
      });

      // Listens to incoming purchase transactions
      purchaseEvent.watch((err, data) => {
        if (err) reject(err);
        genericTransactionHandler(data, true, Enums.TxType.PURCHASE, dispatch);
      });

      resolve();
    }); 

    Promise.all([auctionEventPromise, purchaseEventPromise]).then(values => { 
      dispatch(doneLoadingTransactions());
    });
  };
}

function auctionTransactionHandler(tx, isNew, txType, dispatch) { 
  // Since the auction update is called for new purchases as well as an actual update
  // to an existing price, we use this flag to determine if we should show this transaction
  // from a UI standpoint as an "update price" transaction.
  if (!tx.args.newPurchase) {
    genericTransactionHandler(tx, isNew, txType, dispatch);
  }
}

function genericTransactionHandler(tx, isNew, txType, dispatch) {
  const txStatus = DataActions.determineTxStatus(tx);
  dispatch(addTransaction(tx.transactionHash, txType, txStatus, tx.blockNumber, false));
}
