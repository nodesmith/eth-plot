import { BigNumber } from 'bignumber.js';
import { Dispatch } from 'react-redux';
import * as Web3 from 'web3';

import { DecodedLogEntry } from '../../gen-src/typechain-runtime';
import { EthGrid, EthGridEventTypes } from '../../gen-src/EthGrid';
import * as DataActions from '../actionCreators/DataActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { ContractInfo, PurchaseEventInfo } from '../models';

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

export function addPurchaseEventTransaction(
  purchaseTransaction: PurchaseEventInfo): Action {
  return {
    type: ActionTypes.ADD_PURCHASE_TRANSACTION,
    purchaseTransaction
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
      getPurchaseEvents(contract, currentAddress, dispatch),
      getSaleEvents(contract, currentAddress, dispatch)
    ]);

    dispatch(doneLoadingTransactions());
  };
}

async function getAuctionEvents(contract: EthGrid, currentAddress: string, dispatch: Dispatch<{}>): Promise<void> {
  // The owner filter here only fetches events where the owner is the current address, allowing
  // us to perform that filter on the "server" side.  
  const auctionEvent = contract.AuctionUpdatedEvent({ owner: currentAddress });

  // We really should return this in some way since we need to stop listening to it
  auctionEvent.watch({ fromBlock: 0, toBlock: 'latest' }, (err, tx) => {
    if (!err) {
      genericTransactionHandler(tx, true, Enums.TxType.AUCTION, dispatch);
    }
  });
}

async function getPurchaseEvents(contract: EthGrid, currentAddress: string, dispatch: Dispatch<{}>): Promise<void> {

  const purchaseEvent = contract.PlotPurchasedEvent({});

  // Listens to incoming purchase transactions
  purchaseEvent.watch({ fromBlock: 0, toBlock: 'latest' }, (err, tx) => {
    if (!err) {
      const newPurchaseEventInfo: PurchaseEventInfo = { 
        purchaseIndex: (<BigNumber>tx.args.newZoneId).toNumber(),
        purchasePrice: tx.args.totalPrice.toString(),
        blockNumber: tx.blockNumber!,
        txHash: tx.transactionHash
      };

      dispatch(addPurchaseEventTransaction(newPurchaseEventInfo));

      if (tx.args.buyer === currentAddress) {
        genericTransactionHandler(tx, true, Enums.TxType.PURCHASE, dispatch);
      }
    }
  });
}

async function getSaleEvents(contract: EthGrid, currentAddress: string, dispatch: Dispatch<{}>): Promise<void> {
  const saleEvent = contract.PlotSectionSoldEvent({ seller: currentAddress });

  // We really should return this in some way since we need to stop listening to it
  saleEvent.watch({ fromBlock: 0, toBlock: 'latest' }, (err, event) => {
    if (!err) {
      genericTransactionHandler(event, true, Enums.TxType.SALE, dispatch);
    }
  });
}

function genericTransactionHandler(tx: DecodedLogEntry<{}>, isNew: boolean, txType: Enums.TxType, dispatch: Dispatch<{}>): void {
  const txStatus = DataActions.determineTxStatus(tx);
  dispatch(addTransaction(tx.transactionHash, txType, txStatus, tx.blockNumber!, false));
}
