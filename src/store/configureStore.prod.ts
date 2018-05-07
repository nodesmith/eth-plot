// import { applyMiddleware, compose, createStore, AnyAction, Store } from 'redux';
// import * as reduxThunk from 'redux-thunk';

// import reducers, { RootState } from '../reducers';
// import index from '../reducers/index';

// const finalCreateStore = compose(
//   applyMiddleware(reduxThunk)
// )<RootState>(createStore) ;

// export function configureStore(initialState?: RootState): Store<RootState> {
//   return finalCreateStore(index, initialState);  
// }

import { applyMiddleware, compose, createStore, Middleware, Store, StoreEnhancerStoreCreator } from 'redux';
import { createLogger } from 'redux-logger';
import * as reduxThunk from 'redux-thunk';

import DevTools from '../containers/DevTools';
import reducers, { RootState } from '../reducers';
import index from '../reducers/index';

/**
 * Entirely optional, this tiny library adds some functionality to
 * your DevTools, by logging actions/state to your console. Used in
 * conjunction with your standard DevTools monitor gives you great
 * flexibility!
 */

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(reduxThunk as Middleware)  as (next: StoreEnhancerStoreCreator<RootState>) => StoreEnhancerStoreCreator<RootState>,
  // Required! Enable Redux DevTools with the monitors you chose
  // DevTools.()
)(createStore);

export function configureStore(initialState?: RootState): Store<RootState> {
  const store = finalCreateStore(index, initialState);

  return store;
}
