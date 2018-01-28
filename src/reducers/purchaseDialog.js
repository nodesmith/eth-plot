import * as ActionTypes from '../constants/ActionTypes';
import { PurchaseStage } from '../constants/Enums';

const initialState = {
  isShowing: false,
  purchaseStage: PurchaseStage.NOT_STARTED,
  purchaseCanceled: false
};

export default function purchaseDialog(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.START_PURCHASING_PLOT:
      return Object.assign({}, state, {
        isShowing: true,
        purchaseStage: PurchaseStage.NOT_STARTED,
        purchaseCanceled: false
      });
    case ActionTypes.CHANGE_PURCHASE_STAGE:
      return Object.assign({}, state, {
        purchaseStage: action.purchaseStage
      });
    case ActionTypes.CANCEL_PLOT_PURCHASE:
      return Object.assign({}, state, {
        isShowing: false,
        purchaseCanceled: true
      });
    default:
      return state;
  }
}
