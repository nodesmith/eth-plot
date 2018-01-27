import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isShowing: false
};

export default function purchaseDialog(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.START_PURCHASING_PLOT:
      return Object.assign({}, state, {
        isShowing: true
      });
    default:
      return state;
  }
}
