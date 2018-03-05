import * as ActionTypes from '../constants/ActionTypes';

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

export function addPendingTransaction(txHash, txType) {
  return {
    type: ActionTypes.ADD_PENDING_TRANSACTION,
    txHash,
    txType
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

    // WIP, filter is not yet working
    dispatch(doneLoadingTransactions());

    if (typeof window.web3 !== 'undefined') {
      const newWeb3 = new Web3(window.web3.currentProvider);
      const contractAddress = "0x345ca3e014aaf5dca488057592ee47305d9b3e10";
      const transactionFilter = newWeb3.eth.filter({
        address: contractAddress,
        fromBlock: 1,
        toBlock: 'latest',
        topics: [web3.sha3('AuctionUpdated(uint256,uint256)')]
      }).get(function (err, result) {
        dispatch(doneLoadingTransactions());
      });
      
      transactionFilter.watch((error, result) => {
        console.log("asdfasdf");
      });     
    }
  }
}
