import * as ActionTypes from '../constants/ActionTypes';
const PlotMath = require('../data/PlotMath');

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
  const web3 = new Web3(contractInfo.web3Provider);
  const contract = new web3.eth.Contract(contractInfo.abi, contractInfo.contractAddress);
  return contract;
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

        return contract.methods.ownership(currentIndex++).call().then(ownershipInfo => {
          const ownership = {
            owner: ownershipInfo.owner,
            x: parseInt(ownershipInfo.x),
            y: parseInt(ownershipInfo.y),
            w: parseInt(ownershipInfo.w),
            h: parseInt(ownershipInfo.h)
          };

          ownership.x2 = ownership.x + ownership.w;
          ownership.y2 = ownership.y + ownership.h;

          dispatch(addPlot(ownership));
          return ownership;
        });
      };

      // Create a pool.
      var pool = new PromisePool(ownershipLoadFn, 1);
      
      // Start the pool. 
      return pool.start();
    });
  }
}
