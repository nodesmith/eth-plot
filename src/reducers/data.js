import * as ActionTypes from '../constants/ActionTypes';

// TODO - Clean this up a bit and get from some config file
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;
const contractAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
const web3Provider = 'http://localhost:9545';

const initialState = {
  isFetchingPlots: false,
  numberOfPlots: 0,
  plots: {},
  contractInfo: {
    abi: abi,
    contractAddress: contractAddress,
    web3Provider: web3Provider
  }
};

export default function data(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_PLOT:
      const plotIndex = state.numberOfPlots;
      const newState = Object.assign({}, state, {
        numberOfPlots: plotIndex + 1
      });

      // Assign this new plot at the index of number of plots
      newState.plots[plotIndex] = action.newPlot;
      return newState;
    case ActionTypes.LOAD_PLOTS:
      return Object.assign({}, state, { isFetchingPlots: true} );
    case ActionTypes.LOAD_PLOTS_DONE:
      return Object.assign({}, state, { isFetchingPlots: false} );
    default:
      return state;
  }
}
