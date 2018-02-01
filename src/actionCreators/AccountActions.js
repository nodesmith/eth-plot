import * as ActionTypes from '../constants/ActionTypes';

export function updateMetamaskState(newState) {
  return {
    type: ActionTypes.UPDATE_METAMASK_STATE,
    newState
  };
}

export function updateActiveAccount(newActiveAccount) {
  return {
    type: ActionTypes.UPDATE_ACTIVE_ACCOUNT,
    newActiveAccount
  };
}