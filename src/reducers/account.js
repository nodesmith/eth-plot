import * as ActionTypes from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';

const initialState = {
  metamaskState: Enums.METAMASK_STATE.UNINSTALLED
}

export default function account(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UPDATE_METAMASK_STATE:
    if (action.newState != state.metamaskState) {
      return Object.assign({}, state, { metamaskState: action.newState });
    } else {
      return state;
    }
  default:
    return state;
  }
}
