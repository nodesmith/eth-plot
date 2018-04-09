import * as ActionTypes from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';

const initialState = {
  metamaskStateKnown: false,
  metamaskState: Enums.METAMASK_STATE.UNINSTALLED,
  activeAccount: '',
  userTransactions: {},
  notificationCount: 0,
  isFetchingTransactions: false
}

export default function account(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UPDATE_METAMASK_STATE:
    if (action.newState != state.metamaskState) {
      return Object.assign({}, state, { 
        metamaskState: action.newState,
        metamaskStateKnown: true
      });
    } else {
      return state;
    }
  case ActionTypes.UPDATE_ACTIVE_ACCOUNT:
    return Object.assign({}, state, { activeAccount: action.newActiveAccount });
  case ActionTypes.ADD_TRANSACTION:
    let userTransactionsCopy = Object.assign({}, state.userTransactions);
    userTransactionsCopy[action.txHash] = { 
      txType: action.txType,
      txStatus: action.txStatus,
      blockNumber: action.blockNumber,
      txHash: action.txHash
    };

    // Only queue a notification if this isn't being read from onChain
    const newNotificationCount = (action.isNew) ? state.notificationCount + 1 : state.notificationCount;
    
    return Object.assign({}, state, { 
      userTransactions: userTransactionsCopy,
      notificationCount: newNotificationCount
    });
  case ActionTypes.CLEAR_NOTIFICATION_COUNT:
    return Object.assign({}, state, { notificationCount: 0})
  case ActionTypes.LOAD_TRANSACTIONS:
    return Object.assign({}, state, { isFetchingTransactions: true, userTransactions: {}} );
  case ActionTypes.LOAD_TRANSACTIONS_DONE:
    return Object.assign({}, state, { isFetchingTransactions: false} );
  default:
    return state;
  }
}
