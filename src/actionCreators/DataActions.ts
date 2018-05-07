import { BigNumber } from 'bignumber.js';
import url from 'url';
import * as Web3 from 'web3';

import { EthGrid } from '../../gen-src/EthGrid';
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

export function listPlot() {
  return {
    type: ActionTypes.LIST_PLOT
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

export function determineTxStatus(tx) {
  // TODO couldn't find docs here for other types, this is fragile, doesn't have FAILED type yet.
  if (tx.type === 'mined') {
    return Enums.TxStatus.SUCCESS;
  } else {
    return Enums.TxStatus.PENDING;
  }
}

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
      const plotInfo = await contract.getPlot(i);

      const ipfsHash = web3.toUtf8(plotInfo[7]);

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
        buyoutPrice: plotInfo[5].toNumber(), // TODO
        data: {
          url: plotInfo[6],
          ipfsHash,
          blobUrl: typeof URL !== 'undefined' ? URL.createObjectURL(await loadFromIpfsOrCache(ipfsHash)) : ipfsHash
        },
        zoneIndex: i,
        txHash: ''
      };

      plot.rect.x2 = plot.rect.x + plot.rect.w;
      plot.rect.y2 = plot.rect.y + plot.rect.h;

      dispatch(addPlot(plot)); 
    }

    dispatch(doneLoadingPlots());
  };
}

// thunk for updating price of plot
export function updateAuction(contractInfo, zoneIndex, newPrice) {
  return async (dispatch) => {
    const web3 = getWeb3(contractInfo);
    const coinbase = await getCoinbase(web3);
  
    const contract = await initializeContract(contractInfo);

    const tx = contract.updateAuctionTx(zoneIndex, newPrice, false);
    const gasEstimate = await tx.estimateGas();

    const txObject = {
      from: coinbase,
      gas: gasEstimate.times(2)
    };

    const transactionReceipt = await contract.updateAuctionTx(zoneIndex, newPrice, false).send(txObject);

    const txStatus = determineTxStatus(transactionReceipt);
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

function getCoinbase(web3: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    web3.eth.getCoinbase((error, coinbase) => {
      if (error) reject(error);  
      resolve(coinbase);
    });
  });
}

// This is the actual purchase function which will be a thunk
export function purchasePlot(contractInfo, plots, rectToPurchase, url, ipfsHash, initialBuyout: string, changePurchaseStep) {
  return async (dispatch) => {
    const purchaseInfo = computePurchaseInfo(rectToPurchase, plots);

    const web3 = getWeb3(contractInfo);

    dispatch(changePurchaseStep(Enums.PurchaseStage.WAITING_FOR_UNLOCK));

    const coinbase = await getCoinbase(web3);
    const contract = await initializeContract(contractInfo);

    const purchase = buildArrayFromRectangles([rectToPurchase]);
    const purchasedAreas = buildArrayFromRectangles(purchaseInfo.chunksToPurchase);
    const purchasedAreaIndices = purchaseInfo.chunksToPurchaseAreaIndices.map(num => new BigNumber(num));
    const initialPurchasePrice = new BigNumber(initialBuyout || 0);

    const tx = contract.purchaseAreaWithDataTx(purchase, purchasedAreas, purchasedAreaIndices, ipfsHash, url, initialPurchasePrice);
    const gasEstimate = await tx.estimateGas();
    const txObject = {
      from: coinbase,
      gas: gasEstimate.times(2),
      value: '10' // TODO!!
    };

    const transactionReceipt = await tx.send(txObject);

    const txStatus = determineTxStatus(transactionReceipt);
    dispatch(AccountActions.addTransaction(transactionReceipt, Enums.TxType.PURCHASE, txStatus, Number.MAX_SAFE_INTEGER, true));
    dispatch(togglePurchaseFlow());
    dispatch(changePurchaseStep(Enums.PurchaseStage.DONE));
    dispatch(fetchPlotsFromWeb3(contractInfo));
  };
}
