import { BigNumber } from 'bignumber.js';
import { Dispatch } from 'react-redux';
import * as Web3 from 'web3';

import { promisify, DecodedLogEntry } from '../../gen-src/typechain-runtime';
import { EthGrid } from '../../gen-src/EthGrid';
import * as Actions from '../actions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { computePurchaseInfo } from '../data/ComputePurchaseInfo';
import { loadFromIpfsOrCache } from '../data/ImageRepository';
import * as PlotMath from '../data/PlotMath';
import { ContractInfo, PlotInfo, Rect } from '../models';

import * as AccountActions from './AccountActions';
import { Action } from './EthGridAction';
import { togglePurchaseFlow } from './PurchaseActions';
import { getWeb3 } from './Web3Actions';
const hexy = require('hexy');
const promisePool = require('es6-promise-pool');

export function setWeb3Config(web3Config: ContractInfo) {
  return {
    type: ActionTypes.SET_WEB3_CONFIG,
    web3Config
  };
}

export function addPlot(newPlot) {
  return {
    type: ActionTypes.ADD_PLOT,
    newPlot
  };
}

export function loadPlots() {
  return {
    type: ActionTypes.LOAD_PLOTS
  };
}

export function plotListed(txHash, zoneIndex) {
  return {
    type: ActionTypes.PLOT_LISTED,
    txHash,
    zoneIndex  
  };
}

export function doneLoadingPlots() {
  return {
    type: ActionTypes.LOAD_PLOTS_DONE
  };
}

export function initializeContract(contractInfo: ContractInfo): Promise<EthGrid> {
  const web3 = getWeb3(contractInfo);
  return EthGrid.createAndValidate(web3, contractInfo.contractAddress);
}

export const determineTxStatus = async (tx: DecodedLogEntry<{}>, web3: Web3): Promise<Enums.TxStatus> => {
  // https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events Says that blockNumber and blockHash
  // will be null when the transaction is stil pending
  if (tx.blockNumber !== null) {
    // Grab the transaction receipt and see if it succeeded or failed. 0x1 indicates it succeeded
    // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransactionreceipt
    const txInfo: Web3.TransactionReceipt = await promisify(web3.eth.getTransactionReceipt, [tx.transactionHash]);
    return new BigNumber(txInfo.status!).equals(new BigNumber('0x1')) ? Enums.TxStatus.SUCCESS : Enums.TxStatus.FAILED;
  } else {
    return Enums.TxStatus.PENDING;
  }
};

export function loadBlockInfo(contractInfo: ContractInfo, blockNumber: number) {
  return async (dispatch) => {
    const web3 = getWeb3(contractInfo);
    return new Promise((resolve, reject) => {
      web3.eth.getBlock(blockNumber, (err, blockObj) => {
        if (err) { reject(err); }
        dispatch(addBlockInfo(blockObj));
        resolve();
      });
    });
  };
}

export function addBlockInfo(blockInfo: Web3.BlockWithoutTransactionData): Action {
  return {
    type: ActionTypes.ADD_BLOCK_INFO,
    blockInfo
  };
}

// This is gonna be a thunk action!
export function fetchPlotsFromWeb3(contractInfo) {
  const web3 = getWeb3(contractInfo);
  return async (dispatch) => {
    dispatch(loadPlots());

    // We need to get a handle to the actual instance of our running contract and figure out the current ownership info
    const contract = await initializeContract(contractInfo);

    const ownershipLengthBn: BigNumber = await contract.ownershipLength;
    const ownershipLength = ownershipLengthBn.toNumber();

    for (let i = 0; i < ownershipLength; i++) {
      await addPlotToGrid(contract, i, contractInfo, dispatch);
    }

    dispatch(doneLoadingPlots());
  };
}

export async function addPlotToGrid(contract: EthGrid, plotIndex: number, contractInfo: ContractInfo, dispatch: Dispatch<{}>) {
  const plotInfo = await contract.getPlot(plotIndex);

  const ipfsHash = plotInfo[7];

  const plot: PlotInfo = {
    rect: {
      x: plotInfo[0].toNumber(),
      y: plotInfo[1].toNumber(),
      w: plotInfo[2].toNumber(),
      h: plotInfo[3].toNumber(),
      x2: 0,
      y2: 0
    },
    owner: plotInfo[4],
    buyoutPricePerPixelInWei: plotInfo[5].toString(),
    data: {
      url: plotInfo[6],
      ipfsHash,
      blobUrl: typeof URL !== 'undefined' ? URL.createObjectURL(await loadFromIpfsOrCache(ipfsHash)) : ipfsHash
    },
    zoneIndex: plotIndex,
    txHash: ''
  };

  plot.rect.x2 = plot.rect.x + plot.rect.w;
  plot.rect.y2 = plot.rect.y + plot.rect.h;

  dispatch(addPlot(plot)); 
}

// thunk for updating price of plot
export function updateAuction(contractInfo: ContractInfo, zoneIndex: number, newPrice: string, activeAccount: string) {
  return async (dispatch) => {
    const web3 = getWeb3(contractInfo);
  
    const contract = await initializeContract(contractInfo);

    const price = new BigNumber(newPrice);
    const tx = contract.updateAuctionTx(zoneIndex, price);
    const gasEstimate = await tx.estimateGas({});

    const txObject = {
      from: activeAccount,
      gas: gasEstimate.times(2)
    };

    const transactionReceipt = await tx.send(txObject);

    const txStatus = Enums.TxStatus.PENDING;
    dispatch(AccountActions.addTransaction(transactionReceipt, Enums.TxType.AUCTION, txStatus, Number.MAX_SAFE_INTEGER, true));
    return transactionReceipt;
  };
}

// Converts a rect into the format that our contract is expecting
function buildArrayFromRectangles(rects: Rect[]): Array<BigNumber> { 
  const result = new Array<BigNumber>();
  for (const rect of rects) {
    result.push(new BigNumber(rect.x));
    result.push(new BigNumber(rect.y));
    result.push(new BigNumber(rect.w));
    result.push(new BigNumber(rect.h));
  }

  return result;
}

// This is the actual purchase function which will be a thunk
export function purchasePlot(
  contractInfo: ContractInfo,
  plots: Array<PlotInfo>,
  rectToPurchase: Rect,
  purchasePriceInWei: string,
  url: string | undefined,
  ipfsHash: string,
  initialBuyoutPerPixelInWei: string | undefined,
  changePurchaseStep: Actions.changePurchaseStep,
  activeAccount: string) {
  return async (dispatch): Promise<string> => {
    const purchaseInfo = computePurchaseInfo(rectToPurchase, plots);
    if (!purchaseInfo.isValid) {
      throw new Error(purchaseInfo.errorMessage);
    }
    
    const purchaseData = purchaseInfo.purchaseData!;

    const web3 = getWeb3(contractInfo);

    dispatch(changePurchaseStep(Enums.PurchaseStage.WAITING_FOR_UNLOCK));

    const contract = await initializeContract(contractInfo);

    const purchase = buildArrayFromRectangles([rectToPurchase]);
    const purchasedAreas = buildArrayFromRectangles(purchaseData.chunksToPurchase);
    const purchasedAreaIndices = purchaseData.chunksToPurchaseAreaIndices.map(num => new BigNumber(num));
    const initialPurchasePrice = new BigNumber(purchasePriceInWei);
    const initialBuyoutPerPixelInWeiBN = new BigNumber(initialBuyoutPerPixelInWei || 0);

    const tx = contract.purchaseAreaWithDataTx(
      purchase, purchasedAreas, purchasedAreaIndices, ipfsHash, url || '', initialBuyoutPerPixelInWeiBN);
    const gasEstimate = await tx.estimateGas({ value: purchasePriceInWei });
    const txObject = {
      from: activeAccount,
      gas: gasEstimate.times(2),
      value: purchasePriceInWei
    };

    // Wrap this in a try catch to catch the case where the user rejects
    // the transaction in metamask so that we can show them an error.
    try {
      const transactionReceipt = await tx.send(txObject);

      const txStatus = Enums.TxStatus.PENDING;
      dispatch(AccountActions.addTransaction(transactionReceipt, Enums.TxType.PURCHASE, txStatus, Number.MAX_SAFE_INTEGER, true));
      dispatch(togglePurchaseFlow());
      dispatch(changePurchaseStep(Enums.PurchaseStage.USER_CONFIRM));
      dispatch(resetPurchaseFlow());
      return transactionReceipt;
    } catch (e) {
      dispatch(togglePurchaseFlow());
      dispatch(changePurchaseStep(Enums.PurchaseStage.ERROR));
      return '';
    }
  };
}

export function resetPurchaseFlow() {
  return {
    type: ActionTypes.RESET_PURCHASE_FLOW
  };
}
