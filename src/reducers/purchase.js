import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  purchaseDialogVisible: false,
  rectToPurchase: {}
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
