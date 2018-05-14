import { BigNumber } from 'bignumber.js';
import * as red from 'redux';
import * as Web3 from 'web3';

import { Action } from '../actionCreators/EthGridAction';
import { ActionTypes } from '../constants/ActionTypes';
import { computePurchaseInfo, PurchaseInfo } from '../data/ComputePurchaseInfo';
import * as PlotMath from '../data/PlotMath';
import * as Web3Config from '../data/Web3Config';
import { ContractInfo, HoleInfo, PlotInfo, PurchaseEventInfo, Rect } from '../models';


export interface DataState {
  isFetchingPlots: boolean;
  numberOfPlots: number;
  plots: Array<PlotInfo>;
  plotTransactions: {[plotIndex: number]: PurchaseEventInfo};
  holes: HoleInfo;
  gridInfo: {
    height:number;
    width: number;
  };
  contractInfo: ContractInfo;
  purchaseInfo?: PurchaseInfo;
  lowPlotPrice?: string;
  highPlotPrice?: string;
}


const getInitialState = () => {
  const contractInfo = Web3Config.getWeb3Config();
  
  const initialState: DataState = {
    isFetchingPlots: true,
    numberOfPlots: 0,
    plots: [],
    plotTransactions: {
      0: { purchaseIndex: 0, purchasePrice: '0', blockNumber: 0, txHash: '' } // Initialize the background block
    },
    holes: {},
    gridInfo: {
      height: 250,
      width: 250
    },
    contractInfo,
    purchaseInfo: undefined,
    lowPlotPrice: undefined,
    highPlotPrice: undefined
  };

  return initialState;
};

export function dataReducer(state: DataState, action: Action): DataState {
  if (!state) {
    // tslint:disable-next-line:no-parameter-reassignment
    state = getInitialState();
  }

  switch (action.type) {
    case ActionTypes.ADD_PLOT: {
      const plot: PlotInfo = action.newPlot;
      const buyoutPrice = new BigNumber(plot.buyoutPricePerPixelInWei || 0);
      let { lowPlotPrice, highPlotPrice } = state;

      if (buyoutPrice.greaterThan(0)) {
        if (!lowPlotPrice || buyoutPrice.lessThan(new BigNumber(lowPlotPrice))) {
          lowPlotPrice = plot.buyoutPricePerPixelInWei;
        }

        if (!highPlotPrice || buyoutPrice.greaterThan(new BigNumber(highPlotPrice))) {
          highPlotPrice = plot.buyoutPricePerPixelInWei;
        }
      }

      const newHoles = computeNewHoles(action.newPlot.rect, state.holes, state.plots);

      const newState = Object.assign({}, state, {
        numberOfPlots: state.numberOfPlots + 1,
        holes: newHoles,
        lowPlotPrice,
        highPlotPrice
      });

      newState.plots.push(action.newPlot);
      return newState;
    }
    case ActionTypes.LOAD_PLOTS:
      return Object.assign({}, state, { isFetchingPlots: true, plots: [], newHoles: {} });
    case ActionTypes.LOAD_PLOTS_DONE:
      return Object.assign({}, state, { isFetchingPlots: false });
    case ActionTypes.PLOT_LISTED: {
      const newState = Object.assign({}, state);
      newState.plots[action.zoneIndex].txHash = action.txHash;
      return newState;
    }
    case ActionTypes.SHOW_PURCHASE_DIALOG: {
      const purchaseInfo = computePurchaseInfo(action.rectToPurchase, state.plots);
      return Object.assign({}, state, { purchaseInfo });
    }
    case ActionTypes.ADD_PURCHASE_TRANSACTION: {
      const newPurchaseTransactionInfo: PurchaseEventInfo = action.purchaseTransaction;
      const plotTransactionsCopy = Object.assign({}, state.plotTransactions);
      plotTransactionsCopy[newPurchaseTransactionInfo.purchaseIndex] = newPurchaseTransactionInfo;

      return Object.assign({}, state, { plotTransactions: plotTransactionsCopy });
    }
    case ActionTypes.ADD_BLOCK_INFO: {
      const blockInfo: Web3.BlockWithoutTransactionData = action.blockInfo;
      const plotTransactions = Object.assign({}, state.plotTransactions);
      for (const key of Object.keys(plotTransactions)) {
        if (plotTransactions[key].blockNumber === blockInfo.number) {
          plotTransactions[key].timestamp = blockInfo.timestamp;
        }
      }

      return Object.assign({}, state, { plotTransactions });
    }
    case ActionTypes.SET_WEB3_CONFIG: {
      return Object.assign({}, state, { contractInfo: action.web3Config });
    }
    case ActionTypes.RESET_PURCHASE_FLOW: {
      return Object.assign({}, state, { purchaseInfo: getInitialState().purchaseInfo });
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
        // Interestingly, we actually should never have this happen since the holes should already have been
        // accounted for in previous iterations of this loop
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

        // Subtract 1 so we don't miss the next remainingArea now that we've deleted this one
        remainingAreaIndex--;
      }
    }
  }

  if (remainingAreas.length > 0 && plots.length > 0) {
    throw new Error('Unexpected condition. All areas were not accounted for');
  }

  return result;
}
