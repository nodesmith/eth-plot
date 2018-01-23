import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  purchaseDialogVisible: false,
  rectToPurchase: {},
  purchaseFlowOpen: false,
  imageToPurchase: null
};

function determineInitialRect(imageFileInfo) {
  return {
    x: 100,
    y: 100,
    w: 30,
    h: 30,
    x2: 130,
    y2: 130
  };
}

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
    case ActionTypes.TOGGLE_PURCHASE_FLOW:
      return Object.assign({}, state, {
        purchaseFlowOpen: !state.purchaseFlowOpen
      });
    case ActionTypes.PURCHASE_IMAGE_SELECTED:
      return Object.assign({}, state, {
        imageToPurchase: action.imageFileInfo,
        rectToPurchase: determineInitialRect(action.imageFileInfo)
      })
    default:
      return state;
  }
}
