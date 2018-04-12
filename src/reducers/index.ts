import { combineReducers } from 'redux';

import { accountReducer, AccountState } from './account';
import { dataReducer, DataState } from './data';
import { gridReducer, GridState } from './grid';
import { purchaseReducer, PurchaseState } from './purchase';
import { imageToPurchaseReducer, ImageToPurchaseState } from './imageToPurchase';
import { purchaseDialogReducer, PurchaseDialogState } from './purchaseDialog';

export * from './account';
export * from './data';
export * from './grid';
export * from './imageToPurchase';
export * from './purchase';
export * from './purchaseDialog';

export interface RootState {
  account: AccountState,
  data: DataState,
  grid: GridState,
  purchase: PurchaseState,
  imageToPurchase: ImageToPurchaseState,
  purchaseDialog: PurchaseDialogState
}

/**
 * combineReducers is important to understand. As your app might grow in size
 * and complexity, you will likely begin to split your reducers into separate
 * functions - with each one managing a separate slice of the state! This helper
 * function from 'redux' simply merges the reducers. Keep in mind we are using
 * the ES6 shorthand for property notation.
 *
 * If you're transitioning from Flux, you will notice we only use one store, but
 * instead of relying on multiple stores to manage diff parts of the state, we use
 * various reducers and combine them.
 *
 * More info: http://rackt.org/redux/docs/api/combineReducers.html
 */
const rootReducer = combineReducers<RootState>({
  account: accountReducer,
  data: dataReducer,
  grid: gridReducer,
  purchase: purchaseReducer,
  imageToPurchase: imageToPurchaseReducer,
  purchaseDialog: purchaseDialogReducer
});


export default rootReducer;
