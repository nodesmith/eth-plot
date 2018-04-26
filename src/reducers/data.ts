import * as red from 'redux';

import { Action } from '../actionCreators/EthGridAction';
import { ActionTypes } from '../constants/ActionTypes';
import { computePurchaseInfo, PurchaseInfo } from '../data/ComputePurchaseInfo';
import * as PlotMath from '../data/PlotMath';
import { ContractInfo, HoleInfo, PlotInfo, Rect } from '../models';

// TODO - Clean this up a bit and get from some config file
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;
// const contractAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
// const web3Provider = 'http://localhost:9545';


const contractAddress = '0xcfeb869f69431e42cdb54a4f4f105c19c080a601';
const web3Provider = 'http://localhost:8545';

export interface DataState {
  isFetchingPlots: boolean;
  numberOfPlots: number;
  plots: Array<PlotInfo>;
  holes: HoleInfo;
  gridInfo: {
    height:number;
    width: number;
  };
  contractInfo: ContractInfo;
  purchaseInfo?: PurchaseInfo;
}

const initialState: DataState = {
  isFetchingPlots: false,
  numberOfPlots: 0,
  plots: [],
  holes: {},
  gridInfo: {
    height: 250,
    width: 250
  },
  contractInfo: {
    abi,
    contractAddress,
    web3Provider
  },
  purchaseInfo: undefined,
};

export function dataReducer(state: DataState = initialState, action: Action): DataState {
  switch (action.type) {
    case ActionTypes.ADD_PLOT: {
      const newHoles = computeNewHoles(action.newPlot.rect, state.holes, state.plots);

      const newState = Object.assign({}, state, {
        numberOfPlots: state.numberOfPlots + 1,
        holes: newHoles
      });

      newState.plots.push(action.newPlot);
      return newState;
    }
    case ActionTypes.LOAD_PLOTS:
      return Object.assign({}, state, { isFetchingPlots: true, plots: [], newHoles: {} });
    case ActionTypes.LOAD_PLOTS_DONE:
      return Object.assign({}, state, { isFetchingPlots: false });
    case ActionTypes.LIST_PLOT:
      // TODO
      return state;
    case ActionTypes.PLOT_LISTED: {
      const newState = Object.assign({}, state);
      newState.plots[action.zoneIndex].txHash = action.txHash;
      return newState;
    }
    case ActionTypes.SHOW_PURCHASE_DIALOG: {
      const purchaseInfo = computePurchaseInfo(action.rectToPurchase, state.plots);
      return Object.assign({}, state, { purchaseInfo });
    }
    default:
      return state;
  }
}

function computeNewHoles(rectToAdd: Rect, currentHoles: HoleInfo, plots: Array<PlotInfo>): HoleInfo {
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
        const overlap = PlotMath.computeRectOverlap(currentPlot.rect, currentRemainingArea);

        // Next, add the overlap to the holes for this plotIndex
        const holes = plotIndex in result ? result[plotIndex] : [];
        holes.push(overlap);
        result[plotIndex] = holes;

        // Since we've now accounted for overlap from currentRemainingArea,
        // remove currentRemaingingArea and append any remaining area to the end
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
