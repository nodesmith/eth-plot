import * as ActionTypes from '../constants/ActionTypes';
const PlotMath = require('../data/PlotMath');
import { computePurchaseInfo } from '../data/ComputePurchaseInfo';

const Web3 = require('web3');
const PromisePool = require('es6-promise-pool');

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

export function doneLoadingPlots() {
  return {
    type: ActionTypes.LOAD_PLOTS_DONE
  };
}

function initializeContract(contractInfo) {
  const web3 = getWeb3(contractInfo);
  const contract = new web3.eth.Contract(contractInfo.abi, contractInfo.contractAddress);
  return contract;
}

function getWeb3(contractInfo) {
  const web3 =  window.web3 ? new Web3(window.web3.currentProvider) : new Web3(contractInfo.web3Provider);
  return web3;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// This is gonna be a thunk action!
export function fetchPlotsFromWeb3(contractInfo) {
  return function (dispatch) {
    dispatch(loadPlots());

    // We need to get a handle to the actual instance of our running contract and figure out the current ownership info
    const contract = initializeContract(contractInfo);

    // First make a call to figure out the length of the ownership and data array to iterate through them
    return contract.methods.ownershipLength().call().then(ownershipLengthString => {
      const ownershipLength = parseInt(ownershipLengthString);
      let currentIndex = 0;
      const ownershipLoadFn = () => {
        if (currentIndex >= ownershipLength) {
          // We're done loading here
          return null;
        }

        // Call get plot which returns an array type object which we can get properties from
        return contract.methods.getPlot(currentIndex).call().then(plotInfo => {
          const plot = {
            rect: {
              x: parseInt(plotInfo['0']),
              y: parseInt(plotInfo['1']),
              w: parseInt(plotInfo['2']),
              h: parseInt(plotInfo['3'])
            },
            owner: plotInfo['4'],
            buyoutPrice: parseInt(plotInfo['5']),
            data: {
              url: plotInfo['6'],
              ipfsHash: plotInfo['7']
            },
            color: getRandomColor()
          };

          plot.rect.x2 = plot.rect.x + plot.rect.w;
          plot.rect.y2 = plot.rect.y + plot.rect.h;

          dispatch(addPlot(plot)); 
          currentIndex++;

          return plot;
        });
      };

      // Create a pool.
      var pool = new PromisePool(ownershipLoadFn, 1);
      
      // Start the pool. 
      return pool.start().then(() => {
        dispatch(doneLoadingPlots());
      });
    });
  }
}

// Converts a rect into the format that our contract is expecting
function buildArrayFromRectangles(rects) { 
  let result = [];
  for(const rect of rects) {
    result.push(rect.x);
    result.push(rect.y);
    result.push(rect.w);
    result.push(rect.h);
  }

  return result;
}

// This is the actual purchase function which will be a thunk
export function purchasePlot(contractInfo, plots, rectToPurchase, url, ipfsHash) {
  return function(dispatch) {
    const purchaseInfo = computePurchaseInfo(rectToPurchase, plots);

    const web3 = getWeb3(contractInfo);
    const contract = initializeContract(contractInfo);
    
    const param1 = buildArrayFromRectangles([rectToPurchase]);
    const param2 = buildArrayFromRectangles(purchaseInfo.chunksToPurchase);
    const param3 = purchaseInfo.chunksToPurchaseAreaIndices;
    const param4 = web3.utils.asciiToHex(ipfsHash);
    const param5 = url;
    const param6 = 10;
    const purchaseFunction = contract.methods.purchaseAreaWithData(param1, param2, param3, param4, param5, param6);

    console.log(`${JSON.stringify(param1)}, ${JSON.stringify(param2)}, ${JSON.stringify(param3)}, "${param4}", "${param5}", ${param6}`)
    debugger;

    return web3.eth.getCoinbase().then(coinbase => {
      // return purchaseFunction.estimateGas({from: coinbase, gas: '3000000' }).then((gasEstimate) => {

        const gasEstimate = 2000000;
        return purchaseFunction.send({
          from: coinbase,
          // gasPrice: '30000000000000',
          gasPrice: '30000000',
          gas: gasEstimate * 2
        }).then((transactionReceipt) => {
          // We need to update the ownership and data arrays with the newly purchased plot
          const ownershipInfo = Object.assign({}, rectToPurchase);

          // TODO - Lots of stuff
          return transactionReceipt;
        });
      // });
    });
  };
}
