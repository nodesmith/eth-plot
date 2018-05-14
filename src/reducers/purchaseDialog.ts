import { Action } from '../actionCreators/EthGridAction';
import { ActionTypes } from '../constants/ActionTypes';
import { PurchaseStage } from '../constants/Enums';

export interface PurchaseDialogState {
  isShowing: boolean;
  purchaseStage: PurchaseStage;
}

const initialState: PurchaseDialogState = {
  isShowing: false,
  purchaseStage: PurchaseStage.NOT_STARTED
};

export function purchaseDialogReducer(state: PurchaseDialogState = initialState, action: Action): PurchaseDialogState {
  switch (action.type) {
    case ActionTypes.START_PURCHASING_PLOT:
      return Object.assign({}, state, {
        isShowing: true,
        purchaseStage: PurchaseStage.NOT_STARTED
      });
    case ActionTypes.CHANGE_PURCHASE_STAGE:
      return Object.assign({}, state, {
        purchaseStage: action.purchaseStage,
        isShowing: action.purchaseStage !== PurchaseStage.DONE && action.purchaseStage !== PurchaseStage.NOT_STARTED
      });
    case ActionTypes.CLOSE_PLOT_PURCHASE:
      return Object.assign({}, state, {
        isShowing: false
      });
    case ActionTypes.RESET_PURCHASE_FLOW: {
      return initialState;
    }
    default:
      return state;
  }
}
