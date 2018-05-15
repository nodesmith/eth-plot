import { applyMiddleware, compose, createStore, Middleware, Store, StoreEnhancerStoreCreator } from 'redux';
import * as reduxThunk from 'redux-thunk';

import { RootState } from '../reducers';
import index from '../reducers/index';

const finalCreateStore = compose(
  // Middleware you want to use
  applyMiddleware(reduxThunk as Middleware)  as (next: StoreEnhancerStoreCreator<RootState>) => StoreEnhancerStoreCreator<RootState>,
)(createStore);

export function configureStore(initialState?: RootState): Store<RootState> {
  const store = finalCreateStore(index, initialState);

  return store;
}
