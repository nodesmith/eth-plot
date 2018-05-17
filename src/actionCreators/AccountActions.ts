import { BigNumber } from 'bignumber.js';
import { Dispatch } from 'react-redux';
import * as Web3 from 'web3';

import { DecodedLogEntry } from '../../gen-src/typechain-runtime';
import { EthGrid } from '../../gen-src/EthGrid';
import * as DataActions from '../actionCreators/DataActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { ContractInfo, PurchaseEventInfo } from '../models';

import { Action } from './EthGridAction';
import { getWeb3 } from './Web3Actions';

type UnregisterFn = () => Promise<void>;

// Global list of unregister function, used to stop listening for events
let unregisterFn: UnregisterFn;

export async function unregisterEventListners() {
  if (unregisterFn) {
    await unregisterFn();
  }
}

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

export function reportNumberOfPlots(numberOfPlots: number): Action {
  return {
    type: ActionTypes.REPORT_NUMBER_OF_PLOTS,
    numberOfPlots
  };
}

/**
 * This action adds a new transaction to the list of transactions of the user.
 * This can either be a newly created transaction, or a previous transaction that
 * is stored on chain.  isNew should be true when adding a newly created transaction,
 * and false when reading a transaction from the chain.
 * 
 * uniqueEventHash must uniquely idenitify an transaction event.  This allows us to 
 * add a transaction event when it is pending, and have the successful verison of the
 * same event replace the pending version later on.  
 */
export function addTransaction(
  uniqueEventHash: string, txHash: string, txType: Enums.TxType, txStatus: Enums.TxStatus, blockNumber: number, isNew: boolean): Action {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    uniqueEventHash,
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

export function loadAndWatchEvents(contractInfo: ContractInfo, currentAddress: string) {
  return async (dispatch: Dispatch<{}>) => {
    dispatch(loadTransactions());
    dispatch(DataActions.clearPlots());

    const newWeb3 = getWeb3(contractInfo.web3Provider);
    const contract = await DataActions.initializeContract(contractInfo);

    const numberOfPlots = await contract.ownershipLength;
    dispatch(reportNumberOfPlots(numberOfPlots.toNumber()));
   
    const unregisterPromises = await Promise.all([
      loadAndWatchAuctionEvents(contract, currentAddress, dispatch, newWeb3),
      loadAndWatchPurchaseEvents(contract, contractInfo, currentAddress, dispatch, newWeb3),
      loadAndWatchSaleEvents(contract, currentAddress, dispatch, newWeb3)
    ]);

    unregisterFn = async () => {
      await unregisterPromises[0]();
      await unregisterPromises[1]();
      await unregisterPromises[2]();
    };

    dispatch(doneLoadingTransactions());
  };
}

async function loadAndWatchAuctionEvents(contract: EthGrid, currentAddress: string, dispatch: Dispatch<{}>, web3: Web3): Promise<UnregisterFn> {
  // The owner filter here only fetches events where the owner is the current address, allowing
  // us to perform that filter on the "server" side.  
  const auctionEvent = contract.PlotPriceUpdatedEvent({ owner: currentAddress });
  
  const auctionEvents = await auctionEvent.get({ fromBlock: 0, toBlock: 'latest' });
  let latestBlock = 0;
  auctionEvents.forEach(tx => {
    genericTransactionHandler(tx, (<BigNumber>tx.args.tokenId).toNumber(), Enums.TxType.AUCTION, dispatch, web3);
    latestBlock = Math.max(latestBlock, tx.blockNumber!);
  });
  
  // We really should return this in some way since we need to stop listening to it
  return auctionEvent.watch({ fromBlock: latestBlock + 1 }, (err, tx) => {
    if (!err) {
      genericTransactionHandler(tx, (<BigNumber>tx.args.tokenId).toNumber(), Enums.TxType.AUCTION, dispatch, web3);
    }
  });
}

export async function loadAndWatchPurchaseEvents(
  contract: EthGrid,
  contractInfo: ContractInfo,
  currentAddress: string,
  dispatch: Dispatch<{}>,
  web3: Web3)
  : Promise<UnregisterFn> {
  
  const purchaseEvent = contract.PlotPurchasedEvent({ });

  // Manually add the first plot
  await DataActions.addPlotToGrid(contract, 0, dispatch);

  const purchaseEvents = await purchaseEvent.get({ fromBlock: 0, toBlock: 'latest' });
  let latestBlock = 0;
  const purchaseEventPromises = purchaseEvents.map(tx => {
    latestBlock = Math.max(latestBlock, tx.blockNumber!);
    return handleNewPurchaseEvent(tx, contract, contractInfo, currentAddress, dispatch, web3);
  });

  await Promise.all(purchaseEventPromises);

  // Listens to incoming purchase transactions
  return purchaseEvent.watch({ fromBlock: latestBlock + 1 }, (err, tx) => {
    if (!err) {
      handleNewPurchaseEvent(tx, contract, contractInfo, currentAddress, dispatch, web3);
    }
  });
}

async function handleNewPurchaseEvent(
  tx: any, contract: EthGrid, contractInfo: ContractInfo, currentAddress: string, dispatch: Dispatch<{}>, web3: Web3): Promise<void> {

  await DataActions.addPlotToGrid(contract, new BigNumber(tx.args.newZoneId).toNumber(), dispatch);
  const newZoneId = (<BigNumber>tx.args.newZoneId).toNumber();
  
  const newPurchaseEventInfo: PurchaseEventInfo = { 
    purchaseIndex: newZoneId,
    purchasePrice: tx.args.totalPrice.toString(),
    blockNumber: tx.blockNumber!,
    txHash: tx.transactionHash
  };

  dispatch(addPurchaseEventTransaction(newPurchaseEventInfo));

  if (tx.args.buyer === currentAddress) {
    await genericTransactionHandler(tx, newZoneId, Enums.TxType.PURCHASE, dispatch, web3);
  }
}

async function loadAndWatchSaleEvents(contract: EthGrid, currentAddress: string, dispatch: Dispatch<{}>, web3: Web3): Promise<UnregisterFn> {
  const saleEvent = contract.PlotSectionSoldEvent({ seller: currentAddress });

  const saleEvents = await saleEvent.get({ fromBlock: 0, toBlock: 'latest' });
  let latestBlock = 0;
  saleEvents.forEach(tx => {
    genericTransactionHandler(tx, (<BigNumber>tx.args.plotId).toNumber(), Enums.TxType.SALE, dispatch, web3);
    latestBlock = Math.max(latestBlock, tx.blockNumber!);
  });

  // We really should return this in some way since we need to stop listening to it
  return saleEvent.watch({ fromBlock: latestBlock + 1 }, (err, tx) => {
    if (!err) {
      genericTransactionHandler(tx, (<BigNumber>tx.args.plotId).toNumber(), Enums.TxType.SALE, dispatch, web3);
    }
  });
}

const genericTransactionHandler = async (
  tx: DecodedLogEntry<{}>,
  zoneIndex: number,
  txType: Enums.TxType,
  dispatch: Dispatch<{}>,
  web3: Web3)
  : Promise<void> => {
  const txStatus = await DataActions.determineTxStatus(tx, web3);
  const uniqueEventHash = this.computeUniqueEventHash(txType, tx.transactionHash, zoneIndex);
  dispatch(addTransaction(uniqueEventHash, tx.transactionHash, txType, txStatus, tx.blockNumber!, false));
};

/**
 * Returns a unique hash representing an event.  A single transaction can either have a single
 * auction event or it can have 1 purcahse event and 1+ sale events.  
 * 
 * Thus the event hash will always including the transaction hash, and optionally the zone index
 * that the event is referencing.  The zone index must be provided if the event is a sale event
 * to ensure uniqueness.
 */
export function computeUniqueEventHash(txType: Enums.TxType, txHash: string, zoneIndex?: number): string {
  let uniquePadding = 0;
  
  if (txType === Enums.TxType.SALE) {
    if (zoneIndex === undefined) {
      throw 'Sale transactions require zoneIndex to generate unique hash';
    } else {
      uniquePadding = zoneIndex;
    }
  }

  return `${uniquePadding}-${txHash}-${txType}`;
}
