import { BigNumber } from 'bignumber.js';
import { Dispatch } from 'react-redux';
import * as Web3 from 'web3';

import { DecodedLogEntry } from '../../gen-src/typechain-runtime';
import { EthPlot, EthPlotEventTypes } from '../../gen-src/EthPlot';
import * as DataActions from '../actionCreators/DataActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { ContractInfo, PlotInfo, PurchaseEventInfo } from '../models';

import { Action } from './EthPlotAction';
import { getWeb3 } from './Web3Actions';

type UnregisterFn = () => Promise<void>;

// Global list of unregister function, used to stop listening for events
let unregisterFn: UnregisterFn;

export async function unregisterEventListners() {
  if (unregisterFn) {
    await unregisterFn();
  }
}

export function updateMetamaskState(newState: Enums.METAMASK_STATE, networkName: Enums.NetworkName): Action {
  return {
    type: ActionTypes.UPDATE_METAMASK_STATE,
    newState,
    networkName
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

    const newWeb3 = (await getWeb3(contractInfo))!.web3;
    const contract = await DataActions.initializeContract(contractInfo);

    const numberOfPlots = await contract.ownershipLength;
    dispatch(reportNumberOfPlots(numberOfPlots.toNumber()));
   
    const unregisterPromises = await Promise.all([
      loadAndWatchAuctionEvents(contract, currentAddress, dispatch, newWeb3),
      loadAndWatchPurchaseEvents(contract, contractInfo, currentAddress, numberOfPlots.toNumber(), dispatch, newWeb3),
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

async function loadAndWatchAuctionEvents(contract: EthPlot, currentAddress: string, dispatch: Dispatch<{}>, web3: Web3): Promise<UnregisterFn> {
  // The owner filter here only fetches events where the owner is the current address, allowing
  // us to perform that filter on the "server" side.  
  const auctionEvent = contract.PlotPriceUpdatedEvent({ owner: currentAddress });
  
  const auctionEvents = await auctionEvent.get({ fromBlock: 5737756, toBlock: 'latest' });
  let latestBlock = 0;
  auctionEvents.forEach(tx => {
    genericTransactionHandler(tx, (<BigNumber>tx.args.plotId).toNumber(), Enums.TxType.AUCTION, dispatch, web3);
    latestBlock = Math.max(latestBlock, tx.blockNumber!);
  });
  
  // We really should return this in some way since we need to stop listening to it
  return auctionEvent.watch({ fromBlock: latestBlock + 1 }, (err, tx) => {
    if (!err) {
      genericTransactionHandler(tx, (<BigNumber>tx.args.plotId).toNumber(), Enums.TxType.AUCTION, dispatch, web3);
    }
  });
}

export async function loadAndWatchPurchaseEvents(
  contract: EthPlot,
  contractInfo: ContractInfo,
  currentAddress: string,
  numberOfPlots: number,
  dispatch: Dispatch<{}>,
  web3: Web3)
  : Promise<UnregisterFn> {
  
  const purchaseEvent = contract.PlotPurchasedEvent({ });

  // Manually add the first plot
  await DataActions.addPlotToGrid(contract, 0, dispatch);

  const purchaseEvents = await purchaseEvent.get({ fromBlock: 5737756, toBlock: 'latest' });
  let latestBlock = 0;

  // We get back all of the plot purchase events here and we want to load all of the plot data in parallel.
  // Unfortunately, this is a bit of a problem since we then need to add the plots to the redux store in order.
  // To solve this, create a data structure which queues up plots to add if they're going to be out of order
  let nextItemToAddToPlotsArray = 1;
  const addedPlotsQueue: {[index: number]: PlotInfo} = {};
  const purchaseEventPromises = purchaseEvents.map((tx, index) => {
    latestBlock = Math.max(latestBlock, tx.blockNumber!);

    const plotIndex = new BigNumber(tx.args.newPlotId).toNumber();
    const loadPlotPromise = DataActions.loadPlotData(contract, plotIndex).then(plot => {
      
      // Add this item to the queue at its index
      addedPlotsQueue[plotIndex] = plot;

      // Process the queue here
      for (let i = nextItemToAddToPlotsArray; i < numberOfPlots; i++) {
        if (typeof addedPlotsQueue[i] !== 'undefined') {
          // If there's an item in the queue at this index, add it to the plot array
          dispatch(DataActions.addPlot(addedPlotsQueue[i], i));
        } else {
          // We can't add anything new yet since we don't want to add out of order. Keep track of how far we got
          nextItemToAddToPlotsArray = i;
          break;
        }
      }
    });

    const handlePurchaseEventPromise = handleNewPurchaseEvent(tx, contract, contractInfo, currentAddress, dispatch, web3);
    return Promise.all([loadPlotPromise, handlePurchaseEventPromise]);
  });

  await Promise.all(purchaseEventPromises);

  // Listens to incoming purchase transactions
  return purchaseEvent.watch({ fromBlock: latestBlock + 1 }, (err, tx) => {
    if (!err) {
      const plotId = new BigNumber(tx.args.newPlotId).toNumber();
      DataActions.loadPlotData(contract, plotId).then(plot => {
        dispatch(DataActions.addPlot(plot, plotId));
      });
      handleNewPurchaseEvent(tx, contract, contractInfo, currentAddress, dispatch, web3);
    }
  });
}

async function handleNewPurchaseEvent(
  tx: DecodedLogEntry<EthPlotEventTypes.PlotPurchasedEventArgs>,
  contract: EthPlot, contractInfo: ContractInfo, currentAddress: string, dispatch: Dispatch<{}>, web3: Web3): Promise<void> {

  const newZoneId = (<BigNumber>tx.args.newPlotId).toNumber();
  
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

async function loadAndWatchSaleEvents(contract: EthPlot, currentAddress: string, dispatch: Dispatch<{}>, web3: Web3): Promise<UnregisterFn> {
  const saleEvent = contract.PlotSectionSoldEvent({ seller: currentAddress });

  const saleEvents = await saleEvent.get({ fromBlock: 5737756, toBlock: 'latest' });
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
