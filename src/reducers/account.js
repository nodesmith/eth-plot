import * as ActionTypes from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';

const initialState = {
  metamaskState: Enums.METAMASK_STATE.UNINSTALLED,
  activeAccount: '',
  userTransactions: [],
  notificationCount: 0,
  isFetchingTransactions: false
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
  case ActionTypes.ADD_TRANSACTION:
    let userTransactionsCopy = state.userTransactions.slice();
    userTransactionsCopy.push({ 
      txType: action.txType,
      txHash: action.txHash,
      txStatus: action.txStatus,
      blockNumber: action.blockNumber
    });

    // Only queue a notification if this isn't being read from onChain
    const newNotificationCount = (action.isNew) ? state.notificationCount + 1 : state.notificationCount;
    
    return Object.assign({}, state, { 
      userTransactions: userTransactionsCopy,
      notificationCount: newNotificationCount
    })
  case ActionTypes.CLEAR_NOTIFICATION_COUNT:
    return Object.assign({}, state, { notificationCount: 0})
  case ActionTypes.LOAD_TRANSACTIONS:
    return Object.assign({}, state, { isFetchingTransactions: true} );
  case ActionTypes.LOAD_TRANSACTIONS_DONE:
    return Object.assign({}, state, { isFetchingTransactions: false} );
  default:
    return state;
  }
}
