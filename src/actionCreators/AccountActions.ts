import { Dispatch } from 'react-redux';
import * as Web3 from 'web3';

import { DecodedLogEntry } from '../../gen-src/typechain-runtime';
import { EthGrid2, EthGrid2EventTypes } from '../../gen-src/EthGrid2';
import * as DataActions from '../actionCreators/DataActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { ContractInfo } from '../models';

import { Action } from './EthGridAction';
import { getWeb3 } from './Web3Actions';

export function updateMetamaskState(newState: Enums.METAMASK_STATE): Action {
  return {
    type: ActionTypes.UPDATE_METAMASK_STATE,
    newState
  };
}

export function updateActiveAccount(newActiveAccount: string): Action {
  return {
    type: ActionTypes.UPDATE_ACTIVE_ACCOUNT,
    newActiveAccount
  };
}

// This action adds a new transaction to the list of transactions of the user.
// This can either be a newly created transaction, or a previous transaction that
// is stored on chain.  isNew should be true when adding a newly created transaction,
// and false when reading a transaction from the chain.
export function addTransaction(
  txHash: string, txType: Enums.TxType, txStatus: Enums.TxStatus, blockNumber: number, isNew: boolean): Action {
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

export function fetchAccountTransactions(contractInfo: ContractInfo, currentAddress: string) {
  return async (dispatch: Dispatch<{}>) => {
    dispatch(loadTransactions());

    const newWeb3 = getWeb3(contractInfo);
    const contract = await DataActions.initializeContract(contractInfo);

    await Promise.all([
      getAuctionEvents(contract, currentAddress, dispatch),
      getPurchaseEvents(contract, currentAddress, dispatch)
    ]);

    dispatch(doneLoadingTransactions());
  };
}

async function getAuctionEvents(contract: EthGrid2, currentAddress: string, dispatch: Dispatch<{}>): Promise<void> {
  // The owner filter here only fetches events where the owner is the current address, allowing
  // us to perform that filter on the "server" side.  
  // TODO: do we need some form of paging when a single user has a ton of transactions?
  const auctionEvent = contract.AuctionUpdatedEvent({ owner: currentAddress });
  const events = await auctionEvent.get({ fromBlock: 0, toBlock: 'latest' });

  events.forEach(tx => {
    auctionTransactionHandler(tx, false, Enums.TxType.AUCTION, dispatch);
  });

  // We really should return this in some way since we need to stop listening to it
  auctionEvent.watch({ fromBlock: 0, toBlock: 'latest' }, (err, event) => {
    if (!err) {
      auctionTransactionHandler(event, true, Enums.TxType.AUCTION, dispatch);
    }
  });
}

async function getPurchaseEvents(contract: EthGrid2, currentAddress: string, dispatch: Dispatch<{}>): Promise<void> {

  const purchaseEvent = contract.PlotPurchasedEvent({ buyer: currentAddress });

  // Get's historical purchase transactions for loading user's transaction list
  const events = await purchaseEvent.get({ fromBlock: 0, toBlock: 'latest' });
  events.forEach(tx => {
    genericTransactionHandler(tx, false, Enums.TxType.PURCHASE, dispatch);
  });

  // Listens to incoming purchase transactions
  purchaseEvent.watch({ fromBlock: 0, toBlock: 'latest' }, (err, data) => {
    if (!err) {
      genericTransactionHandler(data, true, Enums.TxType.PURCHASE, dispatch);
    }
  });
}

function auctionTransactionHandler(
  tx: DecodedLogEntry<EthGrid2EventTypes.AuctionUpdatedEventArgs>, isNew: boolean, txType: Enums.TxType, dispatch: Dispatch<{}>): void { 
  // Since the auction update is called for new purchases as well as an actual update
  // to an existing price, we use this flag to determine if we should show this transaction
  // from a UI standpoint as an "update price" transaction.
  if (!tx.args.newPurchase) {
    genericTransactionHandler(tx, isNew, txType, dispatch);
  }
}

function genericTransactionHandler(tx: DecodedLogEntry<{}>, isNew: boolean, txType: Enums.TxType, dispatch: Dispatch<{}>): void {
  const txStatus = DataActions.determineTxStatus(tx);
  dispatch(addTransaction(tx.transactionHash, txType, txStatus, tx.blockNumber!, false));
}
