import * as ActionTypes from '../constants/ActionTypes';

export function updateMetamaskState(newState) {
  return {
    type: ActionTypes.UPDATE_METAMASK_STATE,
    newState
  };
}

