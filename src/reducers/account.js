import * as ActionTypes from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';

const initialState = {
  metamaskState: Enums.METAMASK_STATE.UNINSTALLED,
  activeAccount: ''
}

export default function account(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UPDATE_METAMASK_STATE:
    if (action.newState != state.metamaskState) {
      return Object.assign({}, state, { metamaskState: action.newState });
    } else {
      return state;
    }
  case ActionTypes.UPDATE_ACTIVE_ACCOUNT:
    if (action.newActiveAccount != state.activeAccount) {
      return Object.assign({}, state, { activeAccount: action.newActiveAccount });
    } else {
      return state;
    }
  default:
    return state;
  }
}
