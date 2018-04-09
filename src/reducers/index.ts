import { combineReducers } from 'redux';
import { accountReducer } from './account';
import { dataReducer } from './data';
import { gridReducer } from './grid';
import { purchaseReducer } from './purchase';
import { imageToPurchaseReducer } from './imageToPurchase';
import { purchaseDialogReducer } from './purchaseDialog';

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
const rootReducer = combineReducers({
  account: accountReducer,
  data: dataReducer,
  grid: gridReducer,
  purchase: purchaseReducer,
  image_to_purchase: imageToPurchaseReducer,
  purchaseDialog: purchaseDialogReducer
});

export default rootReducer;
