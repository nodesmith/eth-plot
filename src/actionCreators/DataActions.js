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

// Computes what chunks are needed to be purchased for a particular region
export function computePurchaseInfo(rectToPurchase, plots) {
  let purchasedChunks = [];
  let purchasedChunkAreaIndices = [];
  let purchasePrice = 0;

  // We'll need to walk the ownership array backwards and see who we need to buy chunks from
  let remainingChunksToPurchase = [rectToPurchase];
  let i = plots.length - 1;
  while (remainingChunksToPurchase.length > 0 && i >= 0) {
    const currentPlot = plots[i];

    for (let j = 0; j < remainingChunksToPurchase.length; j++) {
      const chunkToPurchase = remainingChunksToPurchase[j];
      if (PlotMath.doRectanglesOverlap(currentPlot.rect, chunkToPurchase)) {
        // Look at the overlap between the chunk we're trying to purchase, and the ownership plot we have
        const chunkOverlap = PlotMath.computeRectOverlap(currentPlot.rect, chunkToPurchase);

        let newHoles = [chunkOverlap];
        // Next, subtract out all of the holes which this ownerhip may have (TODO)

        // Add these new holes to the current ownership
        // currentOwnership.holes = currentOwnership.holes.concat(newHoles);

        // Add the new holes to the purchaseChunks and keep track of their index
        purchasedChunks = purchasedChunks.concat(newHoles);
        purchasedChunkAreaIndices = purchasedChunkAreaIndices.concat(new Array(newHoles.length).fill(i));

        // Final step is to delete this chunkToPurchase (since it's accounted for) and add whatever is remaining back to remainingChunksToPurchase
        remainingChunksToPurchase.splice(j, 1);
        j--; // subtract one from j so we don't miss anything

        for (const newHole of newHoles) {
          const newChunksToPurchase = PlotMath.subtractRectangles(chunkToPurchase, newHole);
          remainingChunksToPurchase = remainingChunksToPurchase.concat(newChunksToPurchase);
        }
      }
    }
    
    i--;
  }

  if (remainingChunksToPurchase.length > 0) {
    throw 'AHHHHH, something went wrong';
  }

  return {
    chunksToPurchase: purchasedChunks,
    chunksToPurchaseAreaIndices: purchasedChunkAreaIndices,
    purchasePrice: purchasePrice
  };
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

    debugger;

    const web3 = new Web3(contractInfo.web3Provider);
    const contract = initializeContract(contractInfo);
    
    const param1 = buildArrayFromRectangles([rectToPurchase]);
    const param2 = buildArrayFromRectangles(purchaseInfo.chunksToPurchase);
    const param3 = purchaseInfo.chunksToPurchaseAreaIndices;
    const param4 = web3.utils.asciiToHex(ipfsHash);
    const param5 = url;
    const purchaseFunction = contract.methods.purchaseAreaWithData(param1, param2, param3, param4, param5);
    return purchaseFunction.estimateGas({ from: '0x627306090abab3a6e1400e9345bc60c78a8bef57', gas: '3000000' }).then((gasEstimate) => {
      debugger;
      return purchaseFunction.send({
        from: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
        gasPrice: '30000000000000',
        gas: gasEstimate * 2
      }).then((transactionReceipt) => {
        // We need to update the ownership and data arrays with the newly purchased plot
        const ownershipInfo = Object.assign({}, rectToPurchase);

        // TODO - Lots of stuff
        return transactionReceipt;
      });
    });
  };
}
