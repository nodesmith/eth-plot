import * as ActionTypes from '../constants/ActionTypes';

// TODO - Clean this up a bit and get from some config file
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;
const contractAddress = '0xeec918d74c746167564401103096d45bbd494b74';
const web3Provider = 'http://localhost:9545';

const initialState = {
  isFetchingPlots: false,
  numberOfPlots: 0,
  plots: [],
  gridInfo: {
    height: 250,
    width: 250
  },
  contractInfo: {
    abi: abi,
    contractAddress: contractAddress,
    web3Provider: web3Provider
  }
};

export default function data(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_PLOT:
      const newState = Object.assign({}, state, {
        numberOfPlots: state.numberOfPlots + 1
      });

      newState.plots.push(action.newPlot);
      return newState;
    case ActionTypes.LOAD_PLOTS:
      return Object.assign({}, state, { isFetchingPlots: true} );
    case ActionTypes.LOAD_PLOTS_DONE:
      return Object.assign({}, state, { isFetchingPlots: false} );
    default:
      return state;
  }
}
