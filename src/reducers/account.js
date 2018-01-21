import * as ActionTypes from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';

const initialState = {
  metamaskSate: Enums.METAMASK_STATE.UNINSTALLED
}

export default function account(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UPDATE_METAMASK_STATE:
    return Object.assign({}, state, { metamaskSate: action.newState });
  default:
    return state;
  }
}
