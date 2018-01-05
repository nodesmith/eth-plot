import * as ActionTypes from '../constants/ActionTypes';

// TODO - Clean this up a bit and get from some config file
const abi = require('../../contract/build/contracts/EthGrid2.json').abi;
const contractAddress = '0xeec918d74c746167564401103096d45bbd494b74';
const web3Provider = 'http://localhost:9545';

const initialState = {
  purchaseDialogVisible: false,
  rectToPurchase: null
};

export default function purchase(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_PURCHASE_DIALOG:
      return Object.assign({}, state, {
        purchaseDialogVisible: true,
        rectToPurchase: action.rectToPurchase
      });
    case ActionTypes.HIDE_PURCHASE_DIALOG:
      return Object.assign({}, state, {
        purchaseDialogVisible: false
      });
    default:
      return state;
  }
}
