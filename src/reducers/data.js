import * as ActionTypes from '../constants/ActionTypes';
import * as PlotMath from '../data/PlotMath';
import { computePurchaseInfo } from '../data/ComputePurchaseInfo';

// TODO - Clean this up a bit and get from some config file
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;
const contractAddress = '0xf08df3efdd854fede77ed3b2e515090eee765154';
const web3Provider = 'http://localhost:9545';

const initialState = {
  isFetchingPlots: false,
  numberOfPlots: 0,
  plots: [],
  holes: {},
  gridInfo: {
    height: 250,
    width: 250
  },
  contractInfo: {
    abi: abi,
    contractAddress: contractAddress,
    web3Provider: web3Provider
  },
  purchaseInfo: null
};

export default function data(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_PLOT:
      const newHoles = computeNewHoles(action.newPlot.rect, state.holes, state.plots);

      const newState = Object.assign({}, state, {
        numberOfPlots: state.numberOfPlots + 1,
        holes: newHoles
      });

      newState.plots.push(action.newPlot);
      return newState;
    case ActionTypes.LOAD_PLOTS:
      return Object.assign({}, state, { isFetchingPlots: true} );
    case ActionTypes.LOAD_PLOTS_DONE:
      return Object.assign({}, state, { isFetchingPlots: false} );
    case ActionTypes.SHOW_PURCHASE_DIALOG:
      const purchaseInfo = computePurchaseInfo(action.rectToPurchase, state.plots, state.holes);
      return Object.assign({}, state, { purchaseInfo: purchaseInfo} );
    default:
      return state;
  }
}

function computeNewHoles(rectToAdd, currentHoles, plots) {
  const result = Object.assign({}, currentHoles);
  let remainingAreas = [rectToAdd];

  // Iterate backward through all the plots to figure out which of them this new rect adds holes to
  // Stop once we get to the end or there arent' any more areas we need to account for
  for (let plotIndex = plots.length - 1; plotIndex >= 0 && remainingAreas.length > 0; plotIndex--) {
    const currentPlot = plots[plotIndex];

    // Go through all of our remainging areas and check what work we need to do
    for (let remainingAreaIndex = 0; remainingAreaIndex < remainingAreas.length; remainingAreaIndex++) {
      const currentRemainingArea = remainingAreas[remainingAreaIndex];
      if (PlotMath.doRectanglesOverlap(currentPlot.rect, currentRemainingArea)) {
        // These two rects overlap. This overlap will be divided into two parts:
        // 1. The parts which are newly aquired and 2. the parts which already are covered by holes
        // Interestingly, we actually should never have this happen since the holes should already be accounted for 
        let overlap = PlotMath.computeRectOverlap(currentPlot.rect, currentRemainingArea);

        // Next, add the overlap to the holes for this plotIndex
        const holes = plotIndex in result ? result[plotIndex] : [];
        holes.push(overlap);
        result[plotIndex] = holes;

        // Since we've now accounted for overlap from currentRemainingArea, remove currentRemaingingArea and append any remaining area to the end
        const leftoverArea = PlotMath.subtractRectangles(currentRemainingArea, overlap);

        // Do the delete
        remainingAreas.splice(remainingAreaIndex, 1);

        // Append the leftovers
        remainingAreas = remainingAreas.concat(leftoverArea);

        // Subtract 1 so we don't miss the next remainingArea
        remainingAreaIndex--;
      }
    }
  }

  if (remainingAreas.length > 0 && plots.length > 0) {
    throw new Error('Unexpected condition. All areas were not accounted for');
  }

  return result;
}
